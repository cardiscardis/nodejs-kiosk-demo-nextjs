const withYAML = require('next-yaml');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'bitpay.com',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
// next.config.js
module.exports = withYAML(module.exports);
