"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { UpgradePrompt } from '@/components/UpgradePrompt'

interface WorkingModel {
  id: string
  slug: string
  title: string
  description: string
  category: string
  inputSchema: Record<string, any>
}

export default function ModelPage() {
  const params = useParams()
  const router = useRouter()
  const [model, setModel] = useState<WorkingModel | null>(null)
  const [userTier, setUserTier] = useState('FREE')
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [inputs, setInputs] = useState<Record<string, any>>({})
  const [outputs, setOutputs] = useState<any>(null)

  useEffect(() => {
    loadModel()
  }, [params.slug])

  const loadModel = async () => {
    try {
      const res = await fetch(`/api/models/${params.slug}`)
      if (res.ok) {
        const data = await res.json()
        setModel(data.model)
        setUserTier(data.userTier || 'FREE')

        // Initialize inputs with defaults
        const defaults: Record<string, any> = {}
        Object.entries(data.model.inputSchema).forEach(([key, schema]: [string, any]) => {
          defaults[key] = schema.default || ''
        })
        setInputs(defaults)
      }
    } catch (error) {
      console.error('Failed to load model:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  const handleRun = async () => {
    setRunning(true)
    try {
      const res = await fetch(`/api/models/${params.slug}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      })

      if (res.status === 403) {
        router.push('/settings/billing')
        return
      }

      if (res.ok) {
        const data = await res.json()
        setOutputs(data.outputs)
      }
    } catch (error) {
      console.error('Failed to run model:', error)
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading model...</div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Model not found</div>
      </div>
    )
  }

  const canUse = userTier === 'SPARCC' || userTier === 'ENTERPRISE'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/models"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-8"
        >
          ← Back to Models
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-4">
            {model.category.replace('_', ' ')}
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            {model.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {model.description}
          </p>
        </div>

        {!canUse ? (
          <UpgradePrompt
            feature={model.title}
            description="Run this calculator and export results with a SPARCC subscription."
            variant="inline"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
                Inputs
              </h2>

              <div className="space-y-4">
                {Object.entries(model.inputSchema).map(([key, schema]: [string, any]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      {schema.label}
                      {schema.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {schema.type === 'select' ? (
                      <select
                        value={inputs[key] || schema.default || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        {schema.options?.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={schema.type}
                        value={inputs[key] || ''}
                        onChange={(e) => handleInputChange(key, schema.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                        min={schema.min}
                        max={schema.max}
                        required={schema.required}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleRun}
                disabled={running}
                className="w-full mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? 'Calculating...' : 'Run Calculator'}
              </button>
            </div>

            {/* Outputs */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
                Results
              </h2>

              {!outputs ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                    <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Enter inputs and click "Run Calculator" to see results
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(outputs).map(([key, value]: [string, any]) => (
                    <div key={key} className="pb-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                      <div className="text-sm text-zinc-500 dark:text-zinc-500 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {typeof value === 'number' && key.toLowerCase().includes('cost')
                          ? `$${value.toLocaleString()}`
                          : typeof value === 'number' && key.toLowerCase().includes('percent')
                          ? `${value.toFixed(1)}%`
                          : typeof value === 'number'
                          ? value.toLocaleString()
                          : value}
                      </div>
                    </div>
                  ))}

                  {/* Export Actions */}
                  <div className="pt-4 flex gap-3">
                    <button className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                      Export CSV
                    </button>
                    <button className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                      Save to Vault
                    </button>
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
