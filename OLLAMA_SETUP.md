# Ollama + Local LLM Setup for The Toddfather

Use local Llama models for free, fast SPM chat responses. Falls back to OpenAI for complex queries.

---

## Why Local LLM?

**Benefits**:
- 🆓 **Free** - No API costs for chat
- ⚡ **Fast** - 200-500ms responses (vs 1-2s cloud)
- 🔒 **Private** - All SPM data stays local
- 📊 **RAG-ready** - Semantic search over Counsel library

**When to Use**:
- Simple SPM questions ("What's an accelerator?")
- Counsel lookups ("Find info about quota relief")
- Definitions and explanations
- Fast responses for common questions

**When to Fall Back to OpenAI**:
- Complex multi-step reasoning
- Long-form content generation
- When local LLM isn't available
- User preference

---

## Step 1: Install Ollama (5 minutes)

### macOS:
```bash
brew install ollama
```

### Linux:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows:
Download from: https://ollama.com/download

---

## Step 2: Start Ollama Service

```bash
# Start Ollama server (runs in background)
ollama serve
```

**Verify it's running**:
```bash
curl http://localhost:11434/api/tags
```

Should return list of installed models (empty at first).

---

## Step 3: Pull Required Models

### For Chat (Llama 3.2 3B - Fast & Efficient):
```bash
ollama pull llama3.2:3b-instruct-q4_K_M
```

**Why this model**:
- Only 2GB download
- Runs on CPU (no GPU needed)
- Fast inference (~300ms per response)
- Good for Q&A and explanations
- Quantized (q4_K_M) for speed

### For Embeddings (Nomic Embed - Semantic Search):
```bash
ollama pull nomic-embed-text
```

**Why this model**:
- 768-dimensional embeddings
- Optimized for semantic search
- Works great with RAG
- Small and fast

**Download time**: 5-10 minutes total (2GB + 300MB)

---

## Step 4: Test Local LLM

```bash
# Test Llama model
ollama run llama3.2:3b-instruct-q4_K_M "What is an accelerator in sales compensation?"

# Test embeddings
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "test embedding"
}'
```

Should return quick responses.

---

## Step 5: Verify Integration

Your `.env` already has:
```bash
LOCAL_LLM_URL=http://localhost:11434/api/generate
LOCAL_LLM_MODEL=llama3.2:3b-instruct-q4_K_M
OLLAMA_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
USE_LOCAL_LLM=true
```

**Test in your app**:
```bash
# Restart dev server to load new env vars
pkill -f "next dev"
pnpm dev
```

**Test chat**:
1. Go to any Counsel page
2. Click "Ask The Toddfather" chat button
3. Ask: "What is an accelerator?"
4. Check terminal logs - should say: "Using local Llama + RAG for SPM query"

---

## Step 6: Configure for Production (Optional)

### For Better Performance:

**Upgrade to Llama 3.2 11B** (if you have more RAM):
```bash
ollama pull llama3.2:11b-instruct-q4_K_M

# Update .env
LOCAL_LLM_MODEL=llama3.2:11b-instruct-q4_K_M
```

**Or use Llama 3.1 70B** (if you have GPU):
```bash
ollama pull llama3.1:70b-instruct-q4_K_M
```

### Running Ollama as Service:

**macOS/Linux**:
```bash
# Add to ~/.zshrc or ~/.bashrc
export OLLAMA_HOST=0.0.0.0:11434

# Or use systemd service
sudo systemctl enable ollama
sudo systemctl start ollama
```

---

## How It Works

### Chat Flow with Local LLM + RAG:

```
User asks question
    ↓
RAG searches Counsel library (keyword matching for now)
    ↓
Finds top 3 relevant Counsel items
    ↓
Injects Counsel context into prompt
    ↓
Tries local Llama (Ollama) first
    ↓
    If success: Returns response (free, fast)
    ↓
    If fails: Falls back to OpenAI GPT-4o
    ↓
Saves message to history
```

### Example:

**User**: "How do I prevent accelerator abuse?"

**RAG finds**:
- Counsel: payout-curve-behavior-map
- Counsel: where-ai-helps-hurts-spm

**Enhanced prompt sent to Llama**:
```
You are The Toddfather, expert in SPM...

Relevant Counsel from the library:

1. Payout Curve Behavior Map (counsel://payout-curve-behavior-map)
   Curves don't just pay—they shape risk appetite, timing, and discounting

2. Where AI Helps (and Hurts) SPM (counsel://where-ai-helps-hurts-spm)
   AI amplifies your design—good or bad. Governance decides which.

User: How do I prevent accelerator abuse?
```

**Llama response** (~300ms):
```
You can't prevent timing—and you shouldn't try. Timing is rational
behavior when your plan has cliffs.

What you CAN do:
1. Smooth the curve (progressive accelerators, not step functions)
2. Make thresholds annual, not quarterly
3. Monitor timing patterns as early warning

See Counsel: payout-curve-behavior-map for the mechanics.
```

---

## Cost Comparison

| Scenario | Local Llama | OpenAI GPT-4o |
|----------|-------------|---------------|
| 100 chat messages | $0 | ~$0.50-1.00 |
| 1,000 chat messages | $0 | ~$5-10 |
| 10,000 chat messages | $0 | ~$50-100 |

**Electricity cost**: ~$0.01 per 1,000 messages

---

## Performance

| Metric | Local Llama 3.2 3B | OpenAI GPT-4o |
|--------|-------------------|---------------|
| Latency | 200-500ms | 1-2 seconds |
| Quality | Good | Excellent |
| Context Window | 8K tokens | 128K tokens |
| Cost | Free | ~$0.01 per query |

**Recommendation**: Local for 80% of queries, OpenAI for 20% complex ones

---

## Troubleshooting

**"Local LLM not available"**:
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running
ollama serve

# Check if model is pulled
ollama list

# If model missing
ollama pull llama3.2:3b-instruct-q4_K_M
```

**"Slow responses"**:
- Try smaller model: `llama3.2:1b` (1GB, very fast)
- Or use OpenAI fallback: `USE_LOCAL_LLM=false` in `.env`

**"Out of memory"**:
- 3B model needs ~4GB RAM
- Close other apps
- Or use cloud OpenAI only

---

## Current Integration Status

✅ **Built**:
- Local LLM client (`src/lib/ai/local.ts`)
- RAG service with keyword search (`src/lib/rag/service.ts`)
- Embedding generation (`src/lib/rag/embeddings.ts`)
- Chat API integration with local-first strategy
- Automatic fallback to OpenAI

⏸️ **To Enable Full RAG** (when switching to PostgreSQL):
- Install pgvector extension
- Add embedding column to Counsel table
- Index all Counsel with vectors
- Replace keyword search with cosine similarity

🎯 **Current Capability**:
- Works with SQLite (keyword-based retrieval)
- Finds relevant Counsel by text matching
- Injects context into local Llama
- Fast, free responses for common SPM questions

---

## Quick Test

```bash
# 1. Install Ollama
brew install ollama

# 2. Pull models
ollama pull llama3.2:3b-instruct-q4_K_M
ollama pull nomic-embed-text

# 3. Start Ollama
ollama serve

# 4. Restart your dev server
cd /Users/todd.lebaron/dev/thetoddfather
pnpm dev

# 5. Test chat
# Go to http://localhost:3000/counsel/intelligent-sales-foundation
# Click "Ask The Toddfather"
# Ask: "What is intelligent sales?"
# Check terminal - should say "Using local Llama + RAG"
```

**Local LLM + RAG is now integrated!** 🎉

Just run `ollama serve` and you'll get free, fast SPM responses.
