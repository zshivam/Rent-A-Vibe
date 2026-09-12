/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow mobile devices on the local network to access dev resources (JS bundles, HMR).
  // Without this, Next.js 16 Turbopack blocks /_next/* requests from non-localhost origins,
  // causing ALL buttons/interactions to be completely dead on phone.
  allowedDevOrigins: [
    '192.168.1.*',
    '192.168.0.*',
    '10.0.0.*',
    '10.0.1.*',
    '172.16.*.*',
    '172.17.*.*',
    '172.18.*.*',
    '172.19.*.*',
    '172.20.*.*',
    '172.21.*.*',
    '172.22.*.*',
    '172.23.*.*',
    '172.24.*.*',
    '172.25.*.*',
    '172.26.*.*',
    '172.27.*.*',
    '172.28.*.*',
    '172.29.*.*',
    '172.30.*.*',
    '172.31.*.*',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Razorpay uses native Node.js crypto — keep it server-side only
  serverExternalPackages: ['razorpay'],
};

export default nextConfig;
