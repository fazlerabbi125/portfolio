/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.forEach(rule => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach(one => {
          if (!`${one.issuer?.and}`.includes('_app')) return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    });
    return config;
  },
  images: {// by default NextJS has a security feature to prevent loading images from untrusted sources.
    remotePatterns: [
      { // This is done to load images from particular domains. ** means any
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
