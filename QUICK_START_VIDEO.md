# Create Your First Toddfather Video - Quick Start

Follow these steps to create your first AI-generated Toddfather video in ~30 minutes.

---

## Step 1: Get HeyGen API Key (5 minutes)

1. Go to **https://heygen.com**
2. Sign up for account (free trial available)
3. Go to Dashboard → Settings → API Keys
4. Click "Create API Key"
5. Copy the key (starts with `hg_...` or similar)

**Pricing**:
- Free trial: 1 video credit (good for testing)
- Creator: $29/mo (20 credits)
- Pro: $89/mo (100 credits) ← Recommended for regular production

---

## Step 2: Add API Keys to .env (1 minute)

Open `/Users/todd.lebaron/dev/thetoddfather/.env` and add:

```bash
# AI Script Generation (you might already have this)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Video Generation
HEYGEN_API_KEY=your_heygen_key_here

# Video Storage (Vercel Blob - get from Vercel dashboard)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token
```

**Where to get Vercel Blob token**:
1. Go to vercel.com → Your Project → Storage → Blob
2. Create store if needed
3. Copy the `BLOB_READ_WRITE_TOKEN`

---

## Step 3: Prepare Your Toddfather Avatar Image (5 minutes)

**Requirements**:
- Clear headshot of Toddfather character
- Neutral or slight expression (stern works great for noir)
- Looking at camera
- 1024x1024px or larger
- PNG or JPG
- Plain/simple background (HeyGen will remove it)

**Recommended**:
- High contrast lighting (fits noir aesthetic)
- Dark clothing/suit
- Fedora optional but very Toddfather
- Professional quality illustration or photo

**Save it as**: `toddfather-avatar.png`

---

## Step 4: Upload Avatar to HeyGen (3 minutes)

1. **Start your dev server** (if not running):
   ```bash
   cd /Users/todd.lebaron/dev/thetoddfather
   pnpm dev
   ```

2. **Go to Studio Library**:
   ```
   http://localhost:3000/studio/library
   ```

3. **Upload Avatar**:
   - Click "Avatars" tab
   - Click "+ Upload Avatar Image"
   - Select your `toddfather-avatar.png`
   - Wait 2-3 minutes for HeyGen to process

4. **Verify Ready**:
   - Avatar card shows with "Ready" badge
   - Green checkmark means HeyGen has processed it
   - If processing, check back in 2 minutes

---

## Step 5: Create Your First Episode (2 minutes)

1. **Go to Studio Dashboard**:
   ```
   http://localhost:3000/studio
   ```

2. **Click "+ New Episode"**

3. **Fill in form**:
   ```
   Series: Todd Takes

   Title: Accelerators Are Timing Devices

   Premise: Most comp teams think accelerators drive revenue growth.
   They don't. They drive deal timing. Reps optimize WHEN deals close,
   not WHICH deals close. When you put a cliff at 100% attainment with
   a 150% accelerator, you're not incenting selling—you're incenting
   calendar manipulation.

   Target Publish Date: (leave blank or pick a date)
   ```

4. **Click "Create Episode"**

---

## Step 6: Generate Script with AI (30 seconds)

1. On the episode detail page, click **"Generate Script"**
2. Watch status change: DRAFT → GENERATING → PENDING_REVIEW
3. Script appears in preview panel below
4. Review the script - AI wrote it based on your premise!

**What you'll see**:
- Hook (15 seconds)
- Intro (30 seconds)
- Body (3-5 key points)
- Summary (1 minute)
- CTA (15 seconds)

**If you want to edit**: Click on script, modify text, save

---

## Step 7: Generate YouTube Shorts Cut (30 seconds)

1. Click **"Generate Cuts"**
2. AI creates 3 platform versions:
   - YouTube Shorts (30-60s)
   - TikTok (15-60s)
   - LinkedIn (1-3min)

3. Each cut shows in the list with duration and format

**Pick one** for your first video (recommend YouTube Shorts)

---

## Step 8: Generate the Video (10 minutes)

1. In the "Cuts" section, find **"YouTube Shorts"**
2. Click **"Generate Video"** (button will appear when ready)
3. **Select options**:
   - **Avatar**: Your uploaded Toddfather avatar
   - **Voice**: Wayne (AI - Deep & Professional) ← Start here
   - **Aspect Ratio**: 9:16 (Vertical)

4. Click **"Generate Video"**

5. **Wait 5-10 minutes**:
   - Status shows "Generating video..."
   - HeyGen is creating your talking head
   - System auto-polls status every 10 seconds
   - You can leave the page, come back later

6. **When complete**:
   - Green checkmark appears
   - Video preview loads in browser
   - "Download Video" button available

---

## Step 9: Download & Review (2 minutes)

1. **Preview the video** in-browser
   - Plays right on the episode page
   - Check: Lip-sync, expression, quality

2. **Download MP4**:
   - Click "Download Video"
   - Saves to your downloads folder
   - Ready to upload to social media

3. **Review checklist**:
   - ✓ Lip-sync matches script?
   - ✓ Avatar looks good?
   - ✓ Voice is clear?
   - ✓ Duration is right for platform?

---

## Step 10: Publish to Social Media (5 minutes)

**Upload manually** (for now):

### YouTube Shorts:
1. YouTube Studio → Create → Upload videos
2. Select your MP4
3. Title: "Accelerators Are Timing Devices"
4. Description: Add link to Counsel library
5. Shorts feed: Toggle ON
6. Visibility: Public
7. Publish

### TikTok:
1. TikTok app → + → Upload
2. Select MP4
3. Add caption + hashtags (#SPM #SalesComp #SalesStrategy)
4. Post

### Instagram Reels:
1. Instagram app → Reels → Upload
2. Select MP4
3. Add caption
4. Share

---

## 🎉 You Just Created an AI Video!

**From premise → publishable video in ~30 minutes**

---

## 🔄 Create More Videos

Once you've validated the first one:

### Quick Production Loop (20 min per video):

1. **Brainstorm premise** (2 min)
   - Pick an SPM pain point
   - Write 2-3 sentence premise

2. **Create episode** (1 min)
   - Paste premise
   - Click create

3. **Generate all** (2 min)
   - Generate Script
   - Generate Cuts
   - Extract Counsel (optional)

4. **Generate video** (10 min)
   - Pick cut
   - Generate with HeyGen
   - Wait for completion

5. **Download & publish** (5 min)
   - Download MP4
   - Upload to platforms

**You can create 3-5 videos per hour** once you have the flow down!

---

## 💡 Pro Tips

1. **Start with Shorts** (30-60s)
   - Faster to generate
   - Easier to test
   - Better engagement on social

2. **Use AI voice first**
   - Wayne is great for noir/authority
   - Test before recording custom voice

3. **Black background is noir**
   - Don't worry about fancy backgrounds yet
   - Toddfather on black = very on-brand
   - Add captions for visual interest

4. **Batch create**
   - Create 5 episodes with premises
   - Generate all scripts at once
   - Pick best ones to turn into videos

5. **Test on one platform first**
   - Master TikTok OR YouTube Shorts
   - See what works
   - Then expand to other platforms

---

## 🐛 Troubleshooting

**"HeyGen API key not configured"**:
- Add `HEYGEN_API_KEY` to `.env`
- Restart dev server: `pnpm dev`

**"No avatars uploaded yet"**:
- Go to `/studio/library`
- Upload Toddfather image
- Wait for HeyGen to process (check dashboard)

**"Video generation failed"**:
- Check HeyGen dashboard for credits
- Verify avatar is "Ready" status
- Check script isn't too long (>5min = expensive)

**"Video stuck on processing"**:
- HeyGen can take up to 15 minutes for longer scripts
- Status auto-polls every 10 seconds
- Check HeyGen dashboard for actual status

---

## 📊 Current System Status

✅ **Built and Ready**:
- Episode creation
- AI script generation
- Platform cuts
- Counsel extraction
- Avatar upload
- HeyGen video generation
- Status polling
- Auto-download
- Video preview

⏸️ **Optional Add-ons** (tell me if you want these):
- Runway Gen-3 B-roll integration (30 min to build)
- Sora integration (when API available)
- Auto-captions (Whisper API)
- Direct social media publishing (YouTube/TikTok APIs)
- Remotion assembly (advanced editing)

---

## 🚀 Your Next Action

1. **Get HeyGen API key**: https://heygen.com → Settings → API Keys
2. **Add to `.env`**: `HEYGEN_API_KEY=your_key`
3. **Upload Toddfather avatar**: `/studio/library`
4. **Create first episode**: `/studio/episodes/new`
5. **Generate video**: Follow the 4-step pipeline

**Everything is ready. You can create your first video in the next 30 minutes!**

Want me to walk you through it, or do you have your Toddfather avatar ready to upload?
