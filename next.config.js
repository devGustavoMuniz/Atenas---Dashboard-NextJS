const path = require("path");

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@libs": path.resolve(__dirname, "app/lib"),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
    };

    return config;
  },
};

module.exports = nextConfig;
