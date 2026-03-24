/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://digithup.com',
  generateRobotsTxt: true,
  exclude: ['/admin*', '/dashboard*', '/publisher*', '/onboarding*', '/checkout*'], // private routes
}
