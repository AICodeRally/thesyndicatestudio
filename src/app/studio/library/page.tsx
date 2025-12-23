"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Avatar {
  id: string
  name: string
  imageUrl: string
  provider: string // 'heygen' | 'local'
  providerId?: string
  createdAt: string
}

export default function StudioLibraryPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'avatars' | 'voices'>('avatars')

  useEffect(() => {
    loadLibrary()
  }, [])

  const loadLibrary = async () => {
    try {
      const [avatarsRes, voicesRes] = await Promise.all([
        fetch('/api/studio/avatars'),
        fetch('/api/studio/voices'),
      ])

      if (avatarsRes.ok) {
        const data = await avatarsRes.json()
        setAvatars(data.avatars || [])
      }

      if (voicesRes.ok) {
        const data = await voicesRes.json()
        setVoices(data.voices || [])
      }
    } catch (error) {
      console.error('Failed to load library:', error)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('name', file.name.replace(/\.[^/.]+$/, ''))

      const res = await fetch('/api/studio/avatars/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        await loadLibrary()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('audio', file)
      formData.append('name', file.name.replace(/\.[^/.]+$/, ''))

      const res = await fetch('/api/studio/voices/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        await loadLibrary()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/studio"
            className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-4"
          >
            ← Back to Studio
          </Link>

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Asset Library
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your avatars, voices, and visual assets
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 mb-8">
          <button
            onClick={() => setActiveTab('avatars')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'avatars'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Avatars ({avatars.length})
          </button>
          <button
            onClick={() => setActiveTab('voices')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'voices'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Voices ({voices.length})
          </button>
        </div>

        {/* Avatars Tab */}
        {activeTab === 'avatars' && (
          <div>
            <div className="mb-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Upload Your Toddfather Avatar
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Upload a high-quality image of your Toddfather character. Best results with:
                clear face, neutral background, 1024x1024px or larger, PNG/JPG format.
              </p>
              <label className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors">
                {uploading ? 'Uploading...' : '+ Upload Avatar Image'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Uploads to HeyGen for AI avatar creation (~2-3 minutes processing)
              </p>
            </div>

            {avatars.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-600 dark:text-zinc-400">
                  No avatars yet. Upload your first Toddfather character image above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800">
                      {avatar.imageUrl && (
                        <img
                          src={avatar.imageUrl}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm mb-1">
                        {avatar.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                          {avatar.provider}
                        </span>
                        {avatar.providerId && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Voices Tab */}
        {activeTab === 'voices' && (
          <div>
            <div className="mb-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Upload Your Voice (Optional)
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Upload 5+ minutes of clear audio for best voice cloning results. Or use AI voices (no upload needed).
              </p>
              <label className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors">
                {uploading ? 'Uploading...' : '+ Upload Voice Sample'}
                <input
                  type="file"
                  accept="audio/mp3,audio/wav,audio/m4a"
                  onChange={handleVoiceUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Available Voices
              </h3>

              {/* Built-in AI Voices */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        Wayne (Professional Male)
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        AI Voice - Deep, authoritative, good for noir
                      </p>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Default
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        Marcus (Gravelly Male)
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        AI Voice - Rough, experienced, street-smart
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Voices */}
              {voices.length > 0 && (
                <div>
                  <h4 className="font-medium text-zinc-700 dark:text-zinc-300 mb-3 text-sm">
                    Your Custom Voices
                  </h4>
                  <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
                    {voices.map((voice) => (
                      <div key={voice.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-50">
                              {voice.name}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">
                              Custom Voice - {voice.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
