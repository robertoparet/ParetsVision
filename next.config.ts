import type { NextConfig } from "next";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Evitar ejecución de código de prueba en dependencias
    serverComponentsExternalPackages: ['pdf-parse']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevenir que pdf-parse ejecute su código de prueba
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdf-parse': require.resolve('pdf-parse/lib/pdf-parse.js')
      };
    }
    return config;
  }
};

export default nextConfig;
