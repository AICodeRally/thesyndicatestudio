"use client"

import { AskToddfather } from '@/components/chat/AskToddfather'

interface CounselWithChatProps {
  counselTitle: string
  counselOneLiner: string
  counselChannel: string
  userTier?: string
}

export function CounselWithChat({
  counselTitle,
  counselOneLiner,
  counselChannel,
  userTier
}: CounselWithChatProps) {
  return (
    <AskToddfather
      context={{
        counselTitle,
        counselOneLiner,
        counselChannel,
      }}
      userTier={userTier}
    />
  )
}
