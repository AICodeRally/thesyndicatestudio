import { prisma } from '@/lib/db'

export async function isAdminUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  })

  return user?.tier === 'ENTERPRISE'
}
