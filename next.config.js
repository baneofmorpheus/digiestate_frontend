/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'picsum.photos'],
  },
};

module.exports = nextConfig;
