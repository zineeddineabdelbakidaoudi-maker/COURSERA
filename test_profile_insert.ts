import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const profile = await prisma.profile.create({
      data: {
        id: 'test-user-id-' + Math.random().toString(36).substring(7),
        email: 'test-' + Math.random().toString(36).substring(7) + '@example.com',
        full_name: 'Test User',
        role: 'buyer',
      },
    })
    console.log('Successfully created profile:', profile)
  } catch (error) {
    console.error('Error creating profile:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
