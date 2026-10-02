// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for better React development
  reactStrictMode: true,

  // Allow images from external sources if needed later
  images: {
    remotePatterns: [],
  },

  // Server-side packages that should not be bundled into edge runtime
  serverExternalPackages: ['@anthropic-ai/sdk'],
}

export default nextConfig
