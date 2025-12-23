# How to Publish Your Toddfather Video

You're at Step 4! Here's how to finish and publish.

---

## 🎬 Current Status

You've completed:
- ✅ Step 1: Generated Script
- ✅ Step 2: Generated Cuts (YouTube Shorts, TikTok, LinkedIn)
- ✅ Step 3: Extracted Counsel items
- ⏸️ Step 4: **Ready to generate videos and publish**

---

## Option A: Generate Video First (Recommended)

### 1. Generate Video from a Cut (10 minutes)

In **Step 2: Generate Platform Cuts**, you should now see each cut with a **"Generate Video"** button.

**For YouTube Shorts**:
1. Find "YouTube Shorts" cut (30-60s, 9:16)
2. Click **"Generate Video"**
3. A panel opens with options:
   - **Avatar**: Select your uploaded Toddfather avatar
   - **Voice**: Wayne (AI Professional) or your custom voice
   - **Aspect Ratio**: 9:16 (Vertical)
4. Click **"Generate Video"**
5. Wait 5-10 minutes (HeyGen processes)
6. Video appears with preview player
7. Click **"Download Video"**
8. MP4 saved to your downloads

**Repeat for other platforms** (TikTok, LinkedIn) if you want multiple formats.

---

### 2. Upload to YouTube/TikTok (5 minutes)

**YouTube Shorts**:
1. Go to https://studio.youtube.com
2. Click "Create" → "Upload videos"
3. Select your downloaded MP4
4. Add title, description
5. Toggle "Shorts" ON
6. Publish
7. Copy the video URL (e.g., `https://www.youtube.com/watch?v=ABC123`)

**TikTok**:
1. TikTok app → + → Upload
2. Select MP4
3. Add caption + #SPM #SalesComp hashtags
4. Post

**Instagram Reels**:
1. Instagram app → Reels
2. Upload MP4
3. Caption + hashtags
4. Share

---

### 3. Publish Episode in Studio (30 seconds)

Back on your episode page:

**Step 4: Publish Episode**

1. **(Optional)** Paste YouTube URL in the field
   - This embeds the video on your public episode page
   - Not required, but nice to have

2. Click **"Publish Episode"** button

3. Status changes: PENDING_REVIEW → **PUBLISHED**

4. Episode now appears at: `http://localhost:3000/episodes`

5. Public can view it at: `http://localhost:3000/episodes/[your-episode-id]`

---

## Option B: Publish Without Video (Quick Test)

If you just want to test the publish flow:

1. Skip video generation for now
2. Go to **Step 4** on episode page
3. Click **"Publish Episode"**
4. Episode goes live in public library
5. Generate and add video later

---

## What Happens When You Publish

✅ **Episode appears in `/episodes` public library**
- Anyone can browse and watch
- Shows title, premise, series
- If you added YouTube URL, video embeds
- Links to extracted Counsel items

✅ **Counsel items are discoverable**
- Users see "5 Counsel items from this episode"
- Click to view full Counsel
- Save to their Vault
- Drives SPARCC signups

✅ **Content flywheel activated**
- Video → Counsel → Vault → SPARCC subscription

---

## 🎯 What To Do Right Now

**On your episode page**, you should now see:

### Step 2: Generate Platform Cuts ✓
- YouTube Shorts (35s)
  - [**Generate Video**] ← Click this!
- TikTok (35s)
  - [**Generate Video**]
- LinkedIn (120s)
  - [**Generate Video**]

**Click "Generate Video"** on YouTube Shorts:
1. Select your uploaded avatar
2. Choose voice (Wayne)
3. Choose aspect ratio (9:16)
4. Generate!

---

## 🐛 If Video Button Not Showing

The fix is deploying now. Refresh your episode page:

```
http://localhost:3000/studio/episodes/[your-episode-id]
```

You should see "Generate Video" button under each cut.

If not showing, let me know and I'll debug the component integration.

---

## 📊 Summary

**To Publish**:
1. Generate video for at least one cut (optional but recommended)
2. Download MP4
3. Upload to YouTube/TikTok manually
4. (Optional) Paste YouTube URL in Step 4
5. Click "Publish Episode" button
6. Done! Episode is live at `/episodes`

Want me to help debug if the Generate Video buttons aren't showing?
