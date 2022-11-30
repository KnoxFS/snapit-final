/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_HOST_URL || process.env.VERCEL_URL,
  generateRobotsTxt: true,
};
