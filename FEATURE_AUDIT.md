# The Toddfather - Complete Feature Audit

What's **actually working** vs what's **missing** or **stubbed**.

Last Updated: December 22, 2024

---

## ✅ FULLY WORKING (Real CRUD + UI)

### **Counsel Library**

**Create**:
- ✅ Via seed script (`pnpm seed`) - Works
- ❌ No admin UI to create new Counsel (would need to build)

**Read**:
- ✅ `GET /api/counsel` - List all (works)
- ✅ `GET /api/counsel/[slug]` - Detail (works)
- ✅ `/counsel` page - Browse (works)
- ✅ `/counsel/[slug]` page - Detail (works)

**Update**:
- ❌ No update API or UI (would need to build)

**Delete**:
- ❌ No delete API or UI (would need to build)

**Status**: ✅ **READ-ONLY WORKING** - Create via seed only

---

### **Family Vault**

**Save Counsel**:
- ✅ `POST /api/counsel/save` - Save (works)
- ✅ `DELETE /api/counsel/save` - Unsave (works)
- ✅ SaveButton component on Counsel pages (works)

**Collections - Create**:
- ✅ `POST /api/vault/collections` - Create (works)
- ✅ `/vault/collections/new` page - Form (works)

**Collections - Read**:
- ✅ `GET /api/vault/collections` - List user's collections (works)
- ✅ `/vault` page - Shows collections (works)
- ✅ `/vault/collections/[id]` page - Detail (works)

**Collections - Update**:
- ❌ No PATCH `/api/vault/collections/[id]` - **MISSING**
- ❌ No edit UI - **MISSING**

**Collections - Delete**:
- ❌ No DELETE `/api/vault/collections/[id]` - **MISSING**
- ❌ No delete button - **MISSING**

**Collection Items - Add/Remove**:
- ❌ No `POST /api/vault/collections/[id]/items` - **MISSING**
- ❌ No drag-drop or add UI - **MISSING**

**Export**:
- ✅ `GET /api/vault/collections/[id]/export` - Markdown export (works)

**Status**: ⚠️ **CREATE + READ + EXPORT WORKING**, Update/Delete/Item management **MISSING**

---

### **Toddfather Studio (Episodes)**

**Episodes - Create**:
- ✅ `POST /api/studio/episodes` - Create (works)
- ✅ `/studio/episodes/new` page - Form (works)

**Episodes - Read**:
- ✅ `GET /api/studio/episodes` - List (works)
- ✅ `GET /api/studio/episodes/[id]` - Detail (works)
- ✅ `/studio` page - Dashboard (works)
- ✅ `/studio/episodes/[id]` page - Detail (works)

**Episodes - Update**:
- ✅ `PATCH /api/studio/episodes/[id]` - Update (works)
- ❌ No edit form UI - **MISSING** (can only view)

**Episodes - Delete**:
- ❌ No DELETE `/api/studio/episodes/[id]` - **MISSING**
- ❌ No delete button - **MISSING**

**AI Generation**:
- ✅ `POST /api/studio/episodes/[id]/generate-script` - Works with ChatGPT
- ✅ `POST /api/studio/episodes/[id]/generate-cuts` - Works with ChatGPT
- ✅ `POST /api/studio/episodes/[id]/validate` - Counsel extraction (works)
- ✅ `POST /api/studio/episodes/[id]/generate-assets` - B-roll prompts (works)

**Video Generation**:
- ✅ `POST /api/studio/episodes/[id]/render` - HeyGen integration (works)
- ✅ `GET /api/studio/videos/[videoId]/status` - Status polling (works)
- ⚠️ **VideoRenderer component exists but NOT integrated into episode page** - **NEEDS INTEGRATION**

**Publish**:
- ✅ `POST /api/studio/episodes/[id]/publish` - Publish (just built)
- ✅ Publish button in UI (just added)

**Export**:
- ✅ `GET /api/studio/episodes/[id]/export` - Manifest JSON (works)

**Status**: ⚠️ **CREATE + READ + PUBLISH WORKING**, Edit/Delete **MISSING**, Video generation **NEEDS UI INTEGRATION**

---

### **Avatar/Voice Library**

**Avatars - Upload**:
- ✅ `POST /api/studio/avatars/upload` - Upload (works)
- ✅ HeyGen API integration (works)
- ✅ Saves to `public/avatars/` (works)
- ✅ Upload button in `/studio/library` (works)

**Avatars - Read**:
- ✅ `GET /api/studio/avatars` - List (works)
- ✅ Shows in library page (works)

**Avatars - Delete**:
- ❌ No delete API - **MISSING**
- ❌ No delete button - **MISSING**

**Voices - Read**:
- ✅ `GET /api/studio/voices` - List HeyGen voices (works)

**Voices - Upload**:
- ❌ No `POST /api/studio/voices/upload` - **MISSING**
- ❌ Upload button exists but not wired - **NEEDS IMPLEMENTATION**

**Status**: ⚠️ **AVATAR UPLOAD/READ WORKING**, Voice upload and deletes **MISSING**

---

### **AI Chat**

**Chat**:
- ✅ `POST /api/chat` - Streaming chat (works)
- ✅ Local LLM + RAG integration (works if Ollama running)
- ✅ Fallback to ChatGPT (works)
- ✅ Message history save (works)

**History**:
- ✅ `GET /api/chat/history` - Fetch messages (works)

**UI**:
- ✅ AskToddfather component (works)
- ⚠️ **Not showing on Counsel pages** - **NEEDS DEBUGGING**

**Status**: ✅ **API FULLY WORKING**, UI integration needs fix

---

### **Working Models**

**Models - Read**:
- ✅ `GET /api/models` - List (works)
- ✅ `GET /api/models/[slug]` - Detail (works)
- ✅ `/models` page - Browse (works)
- ✅ `/models/[slug]` page - Runner (works)

**Models - Run**:
- ✅ `POST /api/models/[slug]/run` - Calculate (works)
- ✅ Tier enforcement (works)
- ✅ Save to ModelRun table (works)

**Models - Results**:
- ✅ Display formatted results (works)
- ⚠️ Export CSV button exists but **NOT WIRED**
- ⚠️ Save to Vault button exists but **NOT WIRED**

**Status**: ⚠️ **CALCULATION WORKING**, Export/Save buttons **NEED IMPLEMENTATION**

---

### **Public Pages**

**Episodes Library**:
- ✅ `GET /api/episodes` - List published (works)
- ✅ `/episodes` page - Grid (works)
- ✅ `/episodes/[id]` page - Detail with video embed (works)

**Status**: ✅ **FULLY WORKING**

---

## ❌ STUBBED (UI Exists, No Backend)

### **Stripe Integration**:
- ⏸️ Checkout - Returns stub message
- ⏸️ Portal - Returns stub redirect
- ⏸️ Webhooks - Logs but doesn't process
- **Need**: Your Stripe code in 3 files

### **Vercel Blob Storage**:
- ⏸️ Currently saves to `public/` folder
- **Need**: `BLOB_READ_WRITE_TOKEN` for production

---

## 🔴 MISSING FEATURES (Need to Build)

### **Critical for Video Workflow**:

1. **Video Generation UI Integration** - **HIGH PRIORITY**
   - VideoRenderer component exists
   - Not integrated into episode detail page
   - User can't select avatar and generate video from UI
   - **Fix**: Add VideoRenderer to cuts section

2. **Video Download Links**
   - Videos generate but no download button shows
   - **Fix**: Display download link when video completes

3. **Avatar Selection in Video Gen**
   - User uploaded avatar but can't select it
   - **Fix**: Dropdown to choose avatar in VideoRenderer

### **Collection Management**:

4. **Edit Collection**
   - Can create but not edit title/description
   - **Need**: PATCH API + edit form

5. **Delete Collection**
   - Can't remove collections
   - **Need**: DELETE API + delete button with confirmation

6. **Add/Remove Items from Collection**
   - Can't organize Counsel into collections after creating
   - **Need**: POST/DELETE collection items API + drag-drop UI

### **Episode Management**:

7. **Edit Episode**
   - Can't edit title/premise after creation
   - **Need**: Edit form

8. **Delete Episode**
   - Can't remove episodes
   - **Need**: DELETE API + button

9. **Edit Script**
   - Can view but not edit generated script
   - **Need**: Script editor UI

### **Export/Download**:

10. **Model Results Export**
    - CSV button exists but not wired
    - **Need**: CSV generation endpoint

11. **Video Batch Download**
    - Can't download all cuts at once
    - **Need**: Zip download endpoint

---

## 🎯 IMMEDIATE FIX NEEDED

### **Issue**: You can't generate videos from the UI yet

**Problem**: VideoRenderer component exists but not shown on episode page

**Fix Needed**:
1. Add VideoRenderer component to Step 2 (Cuts section)
2. Show "Generate Video" button for each cut
3. Let user select uploaded avatar
4. Trigger HeyGen generation
5. Display video when complete

Should I fix this **right now** so you can actually generate videos from your uploaded avatar?

This is the critical missing piece - everything else works, but the video generation UI isn't connected yet!