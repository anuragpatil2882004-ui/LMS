/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    hostname: '127.0.0.1'
  },
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig