// Feature gating utilities

export type UserTier = 'FREE' | 'SPARCC' | 'ENTERPRISE'

export interface FeatureLimits {
  chatMessages: number | null // null = unlimited
  collections: number | null
  workingModels: boolean
  exportCollections: boolean
  prioritySupport: boolean
}

export const TIER_FEATURES: Record<UserTier, FeatureLimits> = {
  FREE: {
    chatMessages: 3,
    collections: 3,
    workingModels: false,
    exportCollections: false,
    prioritySupport: false,
  },
  SPARCC: {
    chatMessages: null, // unlimited
    collections: null, // unlimited
    workingModels: true,
    exportCollections: true,
    prioritySupport: false,
  },
  ENTERPRISE: {
    chatMessages: null,
    collections: null,
    workingModels: true,
    exportCollections: true,
    prioritySupport: true,
  },
}

export function canUseFeature(tier: UserTier, feature: keyof FeatureLimits): boolean {
  return TIER_FEATURES[tier][feature] !== false
}

export function getFeatureLimit(tier: UserTier, feature: 'chatMessages' | 'collections'): number | null {
  return TIER_FEATURES[tier][feature] as number | null
}

export function hasReachedLimit(
  tier: UserTier,
  feature: 'chatMessages' | 'collections',
  currentCount: number
): boolean {
  const limit = getFeatureLimit(tier, feature)
  if (limit === null) return false // unlimited
  return currentCount >= limit
}

export const SPARCC_PRICE = '$29'
export const SPARCC_PRICE_CENTS = 2900
