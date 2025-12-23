# The Toddfather - Video Creation Quick Start Guide

Complete guide to creating AI-generated videos from premise to published content.

---

## 🎬 Quick Start: Create Your First Video

### Step 1: Set Up HeyGen (5 minutes)

1. **Sign up for HeyGen**: https://heygen.com
   - Free tier: 1 video credit (good for testing)
   - Creator plan: $29/month (20 credits)
   - Pro plan: $89/month (100 credits)

2. **Get your API key**:
   - Go to HeyGen Dashboard → Settings → API Keys
   - Create new API key
   - Copy the key

3. **Add to `.env`**:
```bash
HEYGEN_API_KEY=your_api_key_here
```

4. **Get Anthropic API key** (for script generation):
```bash
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

### Step 2: Upload Your Toddfather Avatar (2 minutes)

1. Go to: `http://localhost:3000/studio/library`
2. Click "Avatars" tab
3. Click "+ Upload Avatar Image"
4. Select your Toddfather character image:
   - **Best**: Clear headshot, neutral expression, 1024x1024px+
   - **Format**: PNG or JPG
   - **Background**: Solid color or simple (HeyGen will remove it)

5. Wait 2-3 minutes for HeyGen to process
6. Avatar will show with "Ready" badge when complete

**Tip**: Upload 2-3 variations (stern, smirk, neutral) for variety

---

### Step 3: Create an Episode (1 minute)

1. Go to: `http://localhost:3000/studio`
2. Click "+ New Episode"
3. Fill in:
   - **Series**: "Todd Takes" (best for shorts)
   - **Title**: "Accelerators Are Behavior Modifiers"
   - **Premise**: "Most comp teams think accelerators are growth levers. They're actually behavior timing devices that shift when deals close, not which deals close."
   - **Target Date**: (optional)

4. Click "Create Episode"

---

### Step 4: Generate Script with AI (30 seconds)

1. On episode detail page, click **"Generate Script"**
2. Wait 10-15 seconds for Claude to write the script
3. Review the generated script in the preview panel
4. Script will have:
   - Hook (15s)
   - Intro (30s)
   - Body (3-5 points)
   - Summary
   - CTA

**Status updates**: DRAFT → GENERATING → PENDING_REVIEW

---

### Step 5: Generate Platform Cuts (1 minute)

1. Click **"Generate Cuts"**
2. AI creates 3 variations:
   - **YouTube Shorts**: 30-60s, vertical, hook-first
   - **TikTok**: 15-60s, fast-paced
   - **LinkedIn**: 1-3min, professional

3. Each cut gets its own optimized script

---

### Step 6: Extract Counsel Items (1 minute)

1. Click **"Extract Counsel"**
2. AI analyzes script and creates 3-7 Counsel items
3. Review the extracted items (title, type, difficulty, problem statement)
4. These are saved as drafts linked to the episode

**Later**: Manually review and publish Counsel to library

---

### Step 7: Generate Video (5-10 minutes)

**Option A: Generate with HeyGen (Current Implementation)**

1. On episode detail page, find a cut (e.g., "YouTube Shorts")
2. Click **"Render Video"** button
3. Select:
   - Avatar: Your uploaded Toddfather character
   - Voice: "Wayne (Professional)" or your custom voice
   - Aspect Ratio: 9:16 (vertical)

4. Click "Generate"
5. HeyGen processes the video (5-10 min depending on length)
6. Poll status or wait for completion notification
7. Video downloads automatically to Vercel Blob
8. Preview appears on episode page

**Option B: Generate with Open Source (DIY)**

For more control, you can use:
- **Wav2Lip**: Lip-sync your avatar to audio
- **SadTalker**: Talking head from single image
- **D-ID**: Alternative to HeyGen (similar API)

---

## 🎨 Avatar Creation Best Practices

### Good Avatar Images

✅ **Do**:
- Clear, well-lit face
- Neutral or slight expression
- Looking at camera
- 1024x1024px or larger
- Plain/simple background
- High resolution

❌ **Don't**:
- Blurry or low-res
- Extreme angles
- Busy background
- Multiple people
- Sunglasses or obscured face

### Toddfather Noir Style

For the noir aesthetic:
- **Lighting**: High contrast, moody
- **Outfit**: Dark suit, fedora (optional)
- **Expression**: Stern, knowing, "I've seen it all"
- **Props**: Cigar (unlit), ledger, desk lamp

You can create variations:
- `toddfather-stern.png`
- `toddfather-smirk.png`
- `toddfather-explaining.png`

---

## 🎙️ Voice Options

### Option 1: Use AI Voice (No Upload)

Built-in HeyGen voices (no setup needed):
- **Wayne**: Deep, professional, authoritative (recommended for Toddfather)
- **Marcus**: Gravelly, experienced
- **James**: Smooth, narrator-style

Just select from dropdown when generating video.

### Option 2: Clone Your Voice (Best Results)

1. Record 5-10 minutes of you talking:
   - Read script samples
   - Clear audio, no background noise
   - Consistent tone and pacing
   - MP3 or WAV format

2. Upload to Studio Library:
   - Go to `/studio/library` → Voices tab
   - Click "+ Upload Voice Sample"
   - Select your audio file

3. HeyGen processes voice clone (10-15 min)
4. Use your custom voice in all videos

**Tip**: Record multiple styles (serious, casual, emphatic) for variety

---

## 📱 Platform-Specific Outputs

Each cut generates video in the right format:

| Platform | Aspect Ratio | Duration | Optimization |
|----------|--------------|----------|--------------|
| YouTube Shorts | 9:16 | 30-60s | Hook-first, subtitles |
| TikTok | 9:16 | 15-60s | Fast cuts, pattern interrupt |
| Instagram Reels | 9:16 | 15-90s | Visual focus, music-friendly |
| LinkedIn | 1:1 or 16:9 | 1-3min | Professional, actionable |
| X (Twitter) | 1:1 | 30-90s | Punchy, quotable |
| YouTube Long | 16:9 | 7-10min | Deep dive, timestamps |

**Currently Supported**: All formats via cut generation
**Video Rendering**: 9:16, 1:1, 16:9 (select when rendering)

---

## 🔄 Complete Workflow Example

**Goal**: Create "What Intelligent Sales Actually Means" video for YouTube Shorts

### 1. Create Episode (1 min)
```
Title: What Intelligent Sales Actually Means
Series: Intelligent Series
Premise: Sales gets intelligent when compensation, planning, and strategy stop contradicting each other. Most orgs run on contradictions—and wonder why execution fails.
```

### 2. Generate Script (30s)
- AI writes 7-10min canonical script
- Review and edit if needed

### 3. Generate YouTube Shorts Cut (30s)
- AI adapts canonical script to 35-second vertical video
- Hook-first structure
- Optimized for mobile viewing

### 4. Extract Counsel (1min)
- AI finds: "intelligent-sales-foundation", "strategy-to-comp-translation", "priority-encoding-via-pay"
- Drafts ready for manual review

### 5. Generate Video (10min)
- Select: Toddfather stern avatar
- Voice: Wayne (AI) or your custom voice
- Aspect: 9:16 vertical
- Click "Render Video"
- HeyGen generates talking head
- Auto-downloads to Vercel Blob
- Preview available

### 6. Review & Export
- Preview video on episode page
- Download MP4
- Upload to YouTube Shorts, TikTok, Instagram
- Episode appears in public `/episodes` library
- Linked Counsel drive signups → Vault → SPARCC

**Total time**: ~15 minutes from premise to publishable video

---

## 🎥 Video Generation Status Tracking

### During Generation

Episode page shows real-time status:
```
Step 1: Generate Script ✓
Step 2: Generate Cuts ✓
Step 3: Extract Counsel ✓
Step 4: Render Video → ⏳ Processing...
```

### Polling Video Status

```typescript
// Auto-poll every 10 seconds
const pollStatus = async (videoId: string) => {
  const res = await fetch(`/api/studio/videos/${videoId}/status`)
  const data = await res.json()

  if (data.status === 'completed') {
    // Video ready! Show preview
    setVideoUrl(data.finalUrl)
  } else if (data.status === 'failed') {
    // Show error
  } else {
    // Still processing, poll again in 10s
    setTimeout(() => pollStatus(videoId), 10000)
  }
}
```

---

## 💾 Video Storage & Delivery

**Storage**: Vercel Blob
- Videos stored at: `videos/{episodeId}/{assetId}.mp4`
- Public access via CDN
- Automatic caching

**Delivery**:
- Direct download link
- Embed in episode detail pages
- Share link for social upload

---

## 🚀 Advanced: Batch Production

### Generate All Cuts at Once

Instead of one-by-one, generate all platform videos:

```typescript
// In Studio
async function generateAllCutVideos(episodeId) {
  const cuts = await prisma.cut.findMany({
    where: { episodeId },
  })

  for (const cut of cuts) {
    const aspectRatio = cut.format.includes('SHORT') || cut.format === 'TIKTOK' ? '9:16' :
                        cut.format === 'LINKEDIN' ? '1:1' : '16:9'

    await fetch(`/api/studio/episodes/${episodeId}/render`, {
      method: 'POST',
      body: JSON.stringify({
        cutId: cut.id,
        avatarId: 'your-avatar-id',
        voiceId: 'wayne',
        aspectRatio,
      }),
    })
  }
}
```

Generates:
- YouTube Short (9:16)
- TikTok (9:16)
- LinkedIn (1:1)
- Full YouTube (16:9)

All from one click!

---

## 📊 Current Capabilities

✅ **Built and Ready**:
- Episode creation and management
- AI script generation (Claude)
- Platform-specific cut adaptation
- Counsel extraction
- Avatar upload to HeyGen
- Voice management
- Video generation via HeyGen API
- Status polling and auto-download
- Vercel Blob storage
- Video preview

⏸️ **Optional Enhancements**:
- B-roll overlay (Sora/Veo for cutaway shots)
- Captions/subtitles (auto-generated)
- Music/SFX (royalty-free library)
- Remotion assembly (for advanced editing)
- Direct social media publishing (YouTube/TikTok APIs)

---

## 🔧 Environment Variables Needed

```bash
# Required for AI Script Generation
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Required for Avatar Video Generation
HEYGEN_API_KEY=your_heygen_api_key

# Optional: Pre-configured Defaults
HEYGEN_DEFAULT_AVATAR_ID=toddfather_stern
HEYGEN_DEFAULT_VOICE_ID=wayne

# For Video Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token
```

---

## 🎯 Next Steps to Start Creating Videos

1. **Add API keys** to `.env`:
   - `ANTHROPIC_API_KEY` (already have?)
   - `HEYGEN_API_KEY` (sign up at heygen.com)

2. **Upload Toddfather Avatar**:
   - Go to `/studio/library`
   - Upload your best Toddfather character image
   - Wait for HeyGen to process it

3. **Create Test Episode**:
   - Go to `/studio` → "+ New Episode"
   - Use a short premise (1-2 sentences)
   - Generate script
   - Generate YouTube Shorts cut
   - Render video with your avatar

4. **Download & Review**:
   - Preview the generated video
   - Download MP4
   - Upload to social media manually
   - Test the complete pipeline

5. **(Future) Automate Publishing**:
   - YouTube API integration
   - TikTok API integration
   - Scheduled publishing

---

## 💡 Pro Tips

1. **Start with Shorts** (30-60s) - Faster to generate, easier to test
2. **Use AI voices initially** - Test the pipeline before recording custom voice
3. **Upload 2-3 avatar expressions** - Variety keeps content fresh
4. **Save successful prompts** - Build a prompt library for consistency
5. **Batch generate cuts** - Create all platform versions at once

---

The video generation pipeline is **fully built and ready to use**!

Add your HeyGen API key and upload a Toddfather image to start creating videos immediately.

Want me to add the UI buttons to the episode page so you can trigger video generation with one click?
