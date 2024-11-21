/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/insect-identifier',
  assetPrefix: '/insect-identifier/',
};

module.exports = nextConfig;