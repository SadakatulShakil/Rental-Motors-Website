/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This allows Next.js to display images from your production sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rental-motors-website.onrender.com', // Allows images from any Render app
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Allows images from Cloudinary
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Allows images during local development
      },
    ],
  },
};

module.exports = nextConfig;