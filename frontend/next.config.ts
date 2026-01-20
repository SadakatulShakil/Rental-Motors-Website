/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This allows Next.js to fetch images from your local backend
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/static/uploads/**',
      },
    ],
  },
};

export default nextConfig;