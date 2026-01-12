'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Avatar {
  id: string
  name: string
  imageUrl: string
  provider: string
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
    <div className="studio-shell min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link href="/studio" className="studio-tag">
          Back to Studio
        </Link>

        <div className="mt-6">
          <h1 className="text-4xl font-serif">Asset Library</h1>
          <p className="mt-2 text-[color:var(--studio-text-muted)]">
            Manage avatars, voices, and visual assets tied to the production line.
          </p>
        </div>

        <div className="mt-10 flex gap-6 border-b border-[color:var(--studio-border)]">
          {['avatars', 'voices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'avatars' | 'voices')}
              className={`pb-3 text-sm uppercase tracking-[0.2em] ${
                activeTab === tab
                  ? 'text-[color:var(--studio-accent)] border-b-2 border-[color:var(--studio-accent)]'
                  : 'text-[color:var(--studio-text-muted)]'
              }`}
            >
              {tab} {tab === 'avatars' ? `(${avatars.length})` : `(${voices.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'avatars' && (
          <div className="mt-8">
            <div className="studio-card p-6">
              <h3 className="text-lg font-semibold text-[color:var(--studio-text)]">
                Upload a Syndicate Avatar
              </h3>
              <p className="mt-2 text-sm text-[color:var(--studio-text-muted)]">
                Best results: clear face, neutral background, 1024x1024px or larger (PNG/JPG).
              </p>
              <label className="mt-4 inline-flex studio-cta cursor-pointer">
                {uploading ? 'Uploading...' : 'Upload Avatar Image'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {avatars.length === 0 ? (
              <div className="mt-6 studio-card p-10 text-center">
                <p className="text-[color:var(--studio-text-muted)]">
                  No avatars yet. Upload the first character portrait.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {avatars.map((avatar) => (
                  <div key={avatar.id} className="studio-card overflow-hidden">
                    <div className="aspect-square bg-[color:var(--studio-surface-2)]">
                      {avatar.imageUrl && (
                        <img
                          src={avatar.imageUrl}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-[color:var(--studio-text)] text-sm">
                        {avatar.name}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="studio-pill">{avatar.provider}</span>
                        {avatar.providerId && (
                          <span className="studio-pill">Ready</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'voices' && (
          <div className="mt-8">
            <div className="studio-card p-6">
              <h3 className="text-lg font-semibold text-[color:var(--studio-text)]">
                Upload a Voice Sample
              </h3>
              <p className="mt-2 text-sm text-[color:var(--studio-text-muted)]">
                Five minutes or more gives the best clone. Optional if you use AI voices only.
              </p>
              <label className="mt-4 inline-flex studio-cta cursor-pointer">
                {uploading ? 'Uploading...' : 'Upload Voice Sample'}
                <input
                  type="file"
                  accept="audio/mp3,audio/wav,audio/m4a"
                  onChange={handleVoiceUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)]">
                  Available Voices
                </h3>
                <div className="mt-3 studio-card divide-y divide-[color:var(--studio-border)]">
                  {[{ name: 'Wayne', note: 'Deep, authoritative noir tone', status: 'Default' },
                    { name: 'Marcus', note: 'Gravelly and street-smart', status: '' }].map((voice) => (
                    <div key={voice.name} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[color:var(--studio-text)]">
                          {voice.name}
                        </p>
                        <p className="text-xs text-[color:var(--studio-text-muted)]">
                          {voice.note}
                        </p>
                      </div>
                      {voice.status && (
                        <span className="studio-pill">{voice.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {voices.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)]">
                    Custom Voices
                  </h4>
                  <div className="mt-3 studio-card divide-y divide-[color:var(--studio-border)]">
                    {voices.map((voice) => (
                      <div key={voice.id} className="p-4">
                        <p className="font-semibold text-[color:var(--studio-text)]">
                          {voice.name}
                        </p>
                        <p className="text-xs text-[color:var(--studio-text-muted)]">
                          Custom voice • {voice.status}
                        </p>
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
