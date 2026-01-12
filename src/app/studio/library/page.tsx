'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Avatar {
  id: string
  name: string
  imageUrl: string
  provider: string
  providerId?: string
  createdAt: string
}

interface Voice {
  id: string
  name: string
  url: string
  provider: string
  status: string
  createdAt: string
}

export default function StudioLibraryPage() {
  const { user } = useAuth()
  const isAdmin = user?.tier === 'ENTERPRISE'
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [voices, setVoices] = useState<Voice[]>([])
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'avatars' | 'voices'>('avatars')
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteAvatar = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/studio/avatars/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setAvatars(avatars.filter(a => a.id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteVoice = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/studio/voices/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setVoices(voices.filter(v => v.id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  const filteredAvatars = avatars.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredVoices = voices.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link href="/studio" className="studio-tag">
          ← Back to Dashboard
        </Link>

        <div className="mt-6">
          <h1 className="text-4xl font-serif">Asset Library</h1>
          <p className="mt-2 text-[color:var(--studio-text-muted)]">
            Manage avatars, voices, and visual assets tied to the production line.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="studio-input w-full max-w-md"
          />
        </div>

        <div className="mt-6 flex gap-6 border-b border-[color:var(--studio-border)]">
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

            {filteredAvatars.length === 0 ? (
              <div className="mt-6 studio-card p-10 text-center">
                <p className="text-[color:var(--studio-text-muted)]">
                  {avatars.length === 0
                    ? 'No avatars yet. Upload the first character portrait.'
                    : 'No avatars match your search.'}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAvatars.map((avatar) => (
                  <div key={avatar.id} className="studio-card overflow-hidden relative group">
                    {/* Delete Confirmation Overlay */}
                    {deleteConfirm === avatar.id && (
                      <div className="absolute inset-0 bg-[color:var(--studio-bg)]/95 flex flex-col items-center justify-center z-10 p-4">
                        <p className="text-sm text-[color:var(--studio-text)] text-center mb-4">
                          Delete "{avatar.name}"?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="studio-cta-ghost text-xs"
                            disabled={deleting}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteAvatar(avatar.id)}
                            disabled={deleting}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {deleting ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    )}

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
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="studio-pill">{avatar.provider}</span>
                          {avatar.providerId && (
                            <span className="studio-pill">Ready</span>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteConfirm(avatar.id)}
                            className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
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

              {filteredVoices.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)]">
                    Custom Voices
                  </h4>
                  <div className="mt-3 studio-card divide-y divide-[color:var(--studio-border)]">
                    {filteredVoices.map((voice) => (
                      <div key={voice.id} className="p-4 flex items-center justify-between group">
                        {/* Delete Confirmation Overlay */}
                        {deleteConfirm === voice.id && (
                          <div className="absolute inset-0 bg-[color:var(--studio-bg)]/95 flex items-center justify-center z-10">
                            <div className="text-center p-4">
                              <p className="text-sm text-[color:var(--studio-text)] mb-4">
                                Delete "{voice.name}"?
                              </p>
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="studio-cta-ghost text-xs"
                                  disabled={deleting}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteVoice(voice.id)}
                                  disabled={deleting}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  {deleting ? '...' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex-1">
                          <p className="font-semibold text-[color:var(--studio-text)]">
                            {voice.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-[color:var(--studio-text-muted)]">
                              Custom voice • {voice.status || 'Ready'}
                            </p>
                            {voice.url && (
                              <audio controls className="h-8 max-w-[200px]">
                                <source src={voice.url} type="audio/mpeg" />
                              </audio>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteConfirm(voice.id)}
                            className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity ml-4"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {voices.length === 0 && (
                <div className="studio-card p-10 text-center">
                  <p className="text-[color:var(--studio-text-muted)]">
                    No custom voices uploaded yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
