const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig;

// next.config.js
const withYAML = require("next-yaml");
module.exports = withYAML(module.exports);
