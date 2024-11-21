/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/Insect-Identifier',
  assetPrefix: '/Insect-Identifier/',
  trailingSlash: true,
};

module.exports = nextConfig;