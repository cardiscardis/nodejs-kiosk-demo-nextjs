const withYAML = require('next-yaml');
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'bitpay.com'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
// next.config.js
module.exports = withYAML(module.exports);
