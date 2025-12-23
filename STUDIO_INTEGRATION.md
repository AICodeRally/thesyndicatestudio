# Toddfather Studio - Video Production Integration Guide

This guide explains how to integrate external AI video generation APIs into the Toddfather Studio pipeline.

## Current Status

✅ **Built and Working**:
- Episode creation and management
- AI script generation (Claude 3.5 Sonnet)
- Platform-specific cut adaptation
- Counsel extraction from scripts
- Asset prompt generation (B-roll, thumbnails)
- Manifest export system

⏸️ **Ready for Integration** (Stubs in place):
- B-roll video generation (Sora, Veo, Runway)
- Avatar/talking head generation (HeyGen)
- Thumbnail image generation (DALL-E, Midjourney)
- Final video assembly (Remotion)

---

## AI Video Generation APIs

### 1. OpenAI Sora 2 (Cinematic B-roll)

**Endpoint**: `POST https://api.openai.com/v1/videos`

**Example Integration**:
```typescript
// src/lib/video/sora.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateSoraVideo(prompt: string, duration: number) {
  const video = await openai.videos.create({
    model: 'sora-2',
    prompt,
    size: '720x1280', // 9:16 for vertical
    duration, // seconds
  })

  return {
    videoUrl: video.url,
    id: video.id,
  }
}
```

**Usage in Asset Generation**:
- Asset prompts are already generated in `/api/studio/episodes/[id]/generate-assets`
- Add worker job to call Sora API with each B-roll prompt
- Store video URL in `Asset.url` field
- Update `Asset.status` to 'COMPLETED'

**Environment Variables**:
```bash
OPENAI_API_KEY=sk-proj-...
SORA_DEFAULT_SIZE=720x1280
SORA_DEFAULT_STYLE=film_noir
```

---

### 2. Google Veo 3.1 (Object Control + Image-to-Video)

**API**: Google AI Studio / Vertex AI

**Example Integration**:
```typescript
// src/lib/video/veo.ts
export async function generateVeoVideo(prompt: string, options?: {
  baseImage?: string
  duration?: number
  style?: string
}) {
  // Use Google Vertex AI client
  const response = await fetch('https://aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/publishers/google/models/veo:predict', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{
        prompt,
        duration: options?.duration || 4,
        image: options?.baseImage,
      }],
    }),
  })

  return response.json()
}
```

**Use Cases**:
- Image-to-video for static Toddfather character poses
- Object addition/removal for editorial control
- Higher prompt adherence than Sora

---

### 3. Runway Gen-3 (Reliable B-roll)

**API**: Runway ML API

**Example Integration**:
```typescript
// src/lib/video/runway.ts
export async function generateRunwayVideo(prompt: string) {
  const response = await fetch('https://api.runwayml.com/v1/video/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      model: 'gen3',
      duration: 4,
      aspect_ratio: '9:16',
    }),
  })

  return response.json()
}
```

---

### 4. HeyGen Avatar IV (Talking Head)

**API**: HeyGen API

**Example Integration**:
```typescript
// src/lib/video/heygen.ts
export async function generateHeyGenAvatar(scriptText: string, options: {
  avatarId?: string
  voiceId?: string
}) {
  const response = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.HEYGEN_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_id: options.avatarId || 'default_avatar',
        },
        voice: {
          type: 'text',
          input_text: scriptText,
          voice_id: options.voiceId || 'toddfather_voice',
        },
      }],
    }),
  })

  return response.json()
}
```

**Setup Steps**:
1. Upload Toddfather character image to HeyGen
2. Create voice clone (record 5min of audio)
3. Get avatar_id and voice_id
4. Store in env vars

**Environment Variables**:
```bash
HEYGEN_API_KEY=...
HEYGEN_AVATAR_ID=toddfather_v1
HEYGEN_VOICE_ID=toddfather_voice_v1
```

---

## Asset Generation Workflow

### Current Flow (Implemented)

1. **User creates episode** → DRAFT status
2. **Click "Generate Script"** → AI writes canonical script
3. **Click "Generate Cuts"** → AI adapts to platforms
4. **Click "Extract Counsel"** → AI finds Counsel items
5. **Click "Generate Assets"** → AI creates B-roll/thumbnail prompts (✅ DONE)

### Next Steps (Integration Needed)

6. **Worker processes B-roll prompts**:
   - For each `Asset` with type='BROLL' and status='PENDING'
   - Call Sora/Veo/Runway API with `Asset.prompt`
   - Download video file
   - Upload to Vercel Blob Storage
   - Update `Asset.url` with blob URL
   - Update `Asset.status` to 'COMPLETED'

7. **Worker processes avatar**:
   - Use canonical script text
   - Call HeyGen API
   - Poll for completion
   - Download video
   - Upload to Blob Storage
   - Create AROLL asset record

8. **Remotion assembly** (Future):
   - Compose: Avatar + B-roll + overlays + captions
   - Apply noir template
   - Render to multiple formats
   - Output final videos

---

## Recommended Implementation Pattern

### Worker Queue System

```typescript
// src/lib/workers/asset-worker.ts
export async function processAssetQueue() {
  const pendingAssets = await prisma.asset.findMany({
    where: { status: 'PENDING' },
    take: 5, // batch size
  })

  for (const asset of pendingAssets) {
    try {
      // Update to PROCESSING
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: 'PROCESSING' },
      })

      let videoUrl
      switch (asset.type) {
        case 'BROLL':
          videoUrl = await generateBroll(asset.prompt!)
          break
        case 'THUMBNAIL':
          videoUrl = await generateThumbnail(asset.prompt!)
          break
      }

      // Update with URL
      await prisma.asset.update({
        where: { id: asset.id },
        data: {
          url: videoUrl,
          status: 'COMPLETED',
        },
      })
    } catch (error) {
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: 'FAILED' },
      })
    }
  }
}
```

### Vercel Cron Job

```typescript
// src/app/api/cron/process-assets/route.ts
import { processAssetQueue } from '@/lib/workers/asset-worker'

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  await processAssetQueue()

  return Response.json({ success: true })
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/process-assets",
    "schedule": "*/5 * * * *"
  }]
}
```

---

## File Storage (Vercel Blob)

Already installed: `@vercel/blob`

**Usage**:
```typescript
import { put } from '@vercel/blob'

// Upload generated video
const blob = await put(`episodes/${episodeId}/broll-${assetId}.mp4`, videoBuffer, {
  access: 'public',
})

// Store URL in database
await prisma.asset.update({
  where: { id: assetId },
  data: { url: blob.url },
})
```

---

## Environment Variables Needed

```bash
# OpenAI (Sora)
OPENAI_API_KEY=sk-proj-...

# Google Cloud (Veo)
GOOGLE_CLOUD_PROJECT=...
GOOGLE_CLOUD_TOKEN=...

# Runway
RUNWAY_API_KEY=...

# HeyGen
HEYGEN_API_KEY=...
HEYGEN_AVATAR_ID=toddfather_v1
HEYGEN_VOICE_ID=toddfather_voice_v1

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Worker Queue
CRON_SECRET=... # Random secure string
```

---

## What's Already Built

### Episode Manifest Export

`GET /api/studio/episodes/[id]/export` returns complete episode data:
```json
{
  "metadata": { "title": "...", "series": "...", "status": "..." },
  "script": { "content": "...", "version": 1 },
  "cuts": [
    { "format": "YT_SHORT", "script": "...", "duration": 35 }
  ],
  "assets": {
    "broll": [{ "prompt": "...", "url": null, "status": "PENDING" }],
    "thumbnails": [...]
  },
  "production": {
    "readyForProduction": true,
    "assetsGenerated": false
  }
}
```

This manifest can drive:
- External rendering pipelines
- Remotion templates
- CLI tools
- Third-party integrations

---

## Next Integration Steps

1. **Add API keys** to `.env`
2. **Install SDKs**: `pnpm add openai @google-cloud/aiplatform heygen-sdk`
3. **Create worker functions** in `src/lib/workers/`
4. **Set up Vercel Cron** or Railway worker
5. **Test end-to-end**: Episode → Assets → Videos
6. **Add Remotion** for final assembly

Want to implement any of these integrations now, or move forward with the current stubbed system?
