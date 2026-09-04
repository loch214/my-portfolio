/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // YouTube poster frames for the click-to-play embeds on case studies
    // (components/VideoEmbed.tsx). Nothing else is loaded from a remote host.
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
  },
}

module.exports = nextConfig

