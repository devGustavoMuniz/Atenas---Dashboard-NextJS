/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // Preserva as configurações anteriores do Webpack
      crypto: false,  // Desabilita o módulo "crypto" no lado do servidor
      stream: false,  // Desabilita o módulo "stream" no lado do servidor
    };
    return config;
  },
};

module.exports = nextConfig;
