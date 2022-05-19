/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

let nextConfig = {
  reactStrictMode: true,
  images: {
    loader: isProduction ? "custom" : "default",
    domains: ["swiperjs.com"],
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.(svg)$/,
      issuer: /\.(js|ts)x?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

if (process.env.ANALYZE) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")();
  nextConfig = withBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
