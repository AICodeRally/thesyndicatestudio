"use client"

import { useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import Link from 'next/link'

interface AskToddfatherProps {
  context?: {
    counselTitle?: string
    counselOneLiner?: string
    counselChannel?: string
    collectionTitle?: string
  }
  userTier?: string
}

export function AskToddfather({ context, userTier = 'FREE' }: AskToddfatherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [showLimitWarning, setShowLimitWarning] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: { context },
    onError: (err) => {
      if (err.message.includes('MESSAGE_LIMIT_REACHED')) {
        setShowLimitWarning(true)
      }
    },
  })

  useEffect(() => {
    // Load message count
    fetch('/api/chat/history')
      .then(res => res.json())
      .then(data => {
        setMessageCount(data.totalCount || 0)
      })
  }, [messages.length])

  const messagesRemaining = userTier === 'FREE' ? Math.max(0, 3 - messageCount) : null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        aria-label="Ask The Toddfather"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Ask The Toddfather
                </h2>
                {messagesRemaining !== null && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {messagesRemaining} {messagesRemaining === 1 ? 'message' : 'messages'} remaining (Free tier)
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Context Banner */}
            {context?.counselTitle && (
              <div className="px-4 py-3 bg-purple-50 dark:bg-purple-950/20 border-b border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-900 dark:text-purple-100">
                  💡 Asking about: <strong>{context.counselTitle}</strong>
                </p>
              </div>
            )}

            {/* Upgrade Warning */}
            {showLimitWarning && (
              <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
                  You've reached the free tier limit (3 messages)
                </p>
                <Link
                  href="/settings/billing"
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  Upgrade to SPARCC for unlimited chat →
                </Link>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    Ask The Toddfather
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                    Get expert guidance on SPM questions. Ask about comp design, planning, governance, or AI in SPM.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error.message || 'An error occurred. Please try again.'}
                  </p>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={showLimitWarning ? "Upgrade to continue chatting..." : "Ask about SPM, comp design, planning..."}
                  disabled={isLoading || showLimitWarning}
                  className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || showLimitWarning}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>

              {messagesRemaining !== null && messagesRemaining <= 1 && !showLimitWarning && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  {messagesRemaining === 1 ? 'Last free message!' : 'Consider upgrading to SPARCC for unlimited chat'}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
