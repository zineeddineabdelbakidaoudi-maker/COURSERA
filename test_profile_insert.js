const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const profile = await prisma.profile.create({
      data: {
        id: 'test-user-id-' + Math.random().toString(36).substring(7),
        email: 'test-' + Math.random().toString(36).substring(7) + '@example.com',
        full_name: 'Test User',
        role: 'buyer',
        // Adding other required fields if any
        country: 'DZ',
        is_verified: false,
        seller_status: 'none',
        publisher_status: 'disabled',
        seller_level: 'new',
        rating_avg: 0,
        total_reviews: 0,
        total_orders_completed: 0,
        credit_balance_dzd: 0
      },
    })
    console.log('Successfully created profile:', JSON.stringify(profile, null, 2))
  } catch (error) {
    console.error('Error creating profile:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
