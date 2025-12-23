# Setup Complete - Create Your First Video

Everything is wired up and working! Here's how to create your first Toddfather video.

---

## ✅ What's Configured

- ✅ **HeyGen API**: Connected and ready
- ✅ **OpenAI API**: Connected (for script generation)
- ✅ **Local LLM**: Ready (optional - install Ollama)
- ✅ **Database**: SQLite with all tables
- ✅ **All features**: Built and tested

---

## 🚀 Create First Video (5 Steps, 30 minutes)

### Step 1: Sign In (2 minutes)

Go to: **http://localhost:3000/auth/signin**

**Option A - Email (Magic Link)**:
- Enter your email
- Click "Send magic link"
- Check email, click link
- You're signed in!

**Option B - Google OAuth** (if configured):
- Click "Sign in with Google"
- Authorize
- You're signed in!

**After signing in**, you'll be at `/vault` dashboard.

---

### Step 2: Upload Toddfather Avatar (5 minutes)

1. **Go to Studio Library**:
   ```
   http://localhost:3000/studio/library
   ```

2. **Prepare your avatar image**:
   - Best: High-quality Toddfather character illustration
   - Format: PNG or JPG
   - Size: 1024x1024px or larger
   - Background: Solid color or simple (HeyGen removes it)
   - Expression: Stern/neutral (very noir)

3. **Upload**:
   - Click "Avatars" tab
   - Click "+ Upload Avatar Image"
   - Select your image file
   - Wait 2-3 minutes for HeyGen to process

4. **Verify**:
   - Avatar card appears with your image
   - Shows "Ready" badge when HeyGen completes processing
   - Note the avatar name for video generation

**If no Toddfather image yet**:
- Use DALL-E or Midjourney to create one:
  - Prompt: "Film noir detective character, Toddfather, stern expression, dark suit, fedora, moody lighting, high contrast, professional headshot, 1940s aesthetic"
- Or use a placeholder for testing

---

### Step 3: Create Episode (2 minutes)

1. **Go to Studio**:
   ```
   http://localhost:3000/studio
   ```

2. **Click "+ New Episode"**

3. **Fill in** (use this test example):
   ```
   Series: Todd Takes

   Title: Accelerators Are Timing Devices

   Premise: Most comp teams think accelerators drive revenue
   growth. They don't. They drive deal timing. Reps optimize
   WHEN deals close, not WHICH deals close. When you put a
   cliff at 100% attainment with a 150% accelerator, you're
   not incenting selling—you're incenting calendar manipulation.

   Target Date: (leave blank)
   ```

4. **Click "Create Episode"**

You're now on the episode detail page with 4 steps.

---

### Step 4: Generate Content with AI (3 minutes)

**4a. Generate Script** (30 seconds):
- Click **"Generate Script"**
- ChatGPT writes 7-10 minute script
- Watch status: DRAFT → GENERATING → PENDING_REVIEW
- Script appears in preview panel below

**4b. Generate Platform Cuts** (30 seconds):
- Click **"Generate Cuts"**
- AI creates YouTube Shorts (35s), TikTok, LinkedIn versions
- Each cut appears in list with duration

**4c. Extract Counsel** (30 seconds) - Optional:
- Click **"Extract Counsel"**
- AI finds 3-7 Counsel items from script
- Draft Counsel linked to episode

---

### Step 5: Generate Video (10-15 minutes)

1. **Find the YouTube Shorts cut** in Step 2 section

2. **Click "Generate Video"** button

3. **Configure**:
   - **Avatar**: Select your uploaded Toddfather avatar
   - **Voice**: Wayne (AI - Deep & Professional)
   - **Aspect Ratio**: 9:16 (Vertical)

4. **Click "Generate"**

5. **Wait** (5-10 minutes):
   - Status shows "Generating video..."
   - HeyGen creates your talking head
   - Page auto-polls status every 10 seconds
   - Green checkmark when complete

6. **Preview & Download**:
   - Video player appears
   - Watch your Toddfather avatar speaking the script!
   - Click "Download Video"
   - MP4 saved to downloads folder

---

### Step 6: Publish to Social Media (5 minutes)

**Upload to YouTube Shorts**:
1. YouTube Studio → Create → Upload
2. Select downloaded MP4
3. Title: "Accelerators Are Timing Devices"
4. Toggle "Shorts" ON
5. Add description + link to thetoddfather.com/counsel
6. Publish!

**Upload to TikTok/Instagram**:
- Same MP4 works for all platforms
- Add captions if needed (or use auto-captions)

---

## 🎯 What Happens Next

After publishing:
- Video appears in your `/episodes` public library
- Links to extracted Counsel items
- Users watch → discover Counsel → save to Vault → upgrade to SPARCC

**Content Flywheel**: Video → Counsel → Vault → SPARCC subscription 💰

---

## 🐛 Troubleshooting

**"Nothing happening when I click upload"**:
→ Make sure you're **signed in** first (go to `/auth/signin`)

**"Unauthorized error"**:
→ Sign in at `/auth/signin`

**"HeyGen not configured"**:
→ Already fixed! Your key is in `.env`

**"Script generation failed"**:
→ Check OpenAI API key in `.env` (already added)
→ Check OpenAI account has credits

**"Video stuck on processing"**:
→ HeyGen can take 10-15 minutes for longer scripts
→ Check HeyGen dashboard: https://app.heygen.com
→ Page auto-refreshes status every 10 seconds

**"Avatar not showing as Ready"**:
→ HeyGen processes avatars in 2-5 minutes
→ Refresh `/studio/library` page
→ Check HeyGen dashboard for processing status

---

## 📊 System Status

**Working and Ready**:
- ✅ Authentication (magic link + Google OAuth)
- ✅ Avatar upload (local storage + HeyGen)
- ✅ AI script generation (ChatGPT GPT-4o)
- ✅ Platform cuts (AI adaptation)
- ✅ Counsel extraction (AI analysis)
- ✅ Video generation (HeyGen talking head)
- ✅ Local LLM + RAG (optional, if Ollama installed)
- ✅ Download and preview
- ✅ Complete workflow

**Optional Enhancements** (tell me if you want these):
- B-roll generation (Runway Gen-3 or Sora when available)
- Auto-captions (Whisper API)
- Direct YouTube/TikTok API upload
- Batch video generation

---

## 🎬 Your Immediate Next Step

**Sign in** at: http://localhost:3000/auth/signin

Then:
1. Go to `/studio/library`
2. Upload Toddfather avatar
3. Create first episode
4. Generate video

**You can have your first video in 30 minutes!**

Do you have a Toddfather avatar image ready, or should I help you create one with DALL-E/Midjourney?
