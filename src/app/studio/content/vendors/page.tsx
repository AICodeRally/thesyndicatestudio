'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function VendorsAdminPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const isAdmin = session?.user?.tier === 'ENTERPRISE'

  useEffect(() => {
    fetch('/api/content/vendors')
      .then((res) => res.json())
      .then((data) => setVendors(data.vendors || []))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vendor?')) return
    await fetch(`/api/content/vendors/${id}`, { method: 'DELETE' })
    setVendors(vendors.filter((v) => v.id !== id))
  }

  if (loading) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--studio-text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <span className="studio-tag">Vendors</span>
            <h1 className="mt-4 text-4xl font-serif">Vendor Scorecards</h1>
          </div>
          <Link href="/studio/content/vendors/new" className="studio-cta">
            Add Vendor
          </Link>
        </div>

        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="studio-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--studio-text)]">
                  {vendor.vendorName}
                </h2>
                <p className="text-sm text-[color:var(--studio-text-muted)]">
                  Rating: {vendor.overallRating}/5
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Link href={`/studio/content/vendors/${vendor.id}`} className="studio-cta-ghost">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="studio-cta-ghost text-[color:var(--studio-accent-3)] border-[color:var(--studio-accent-3)]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
