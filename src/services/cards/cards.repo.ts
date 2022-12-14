import { PrismaClient } from '@prisma/client'
import { Account } from '@/domain/account'
import { Profile } from '@/domain/profile'

export const cardsRepo = ({ prisma }: { prisma: PrismaClient }) => ({
  async getProfileId(accountId: Account['id']) {
    return (
      await prisma.profile.findUnique({
        where: {
          accountId,
        },
        select: {
          id: true,
        },
      })
    )?.id
  },
  async getProfiles(profileId: Profile['id'], count: number) {
    return await prisma.profile.findMany({
      where: {
        NOT: {
          OR: [
            {
              id: profileId,
              // excluding our profile
            },
            {
              recipientSparks: {
                some: { initiatorId: profileId },
                // excluding profiles which resolved/submitted our spark
              },
            },
            {
              initiatedSparks: {
                some: { recipientId: profileId, isSubmitted: true },
                // excluding profiles for which we resolved their spark
              },
            },
          ],
        },
      },
      include: {
        work: true,
        graduate: true,
      },
      take: count,
    })
  },
})
