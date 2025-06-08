import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para manejar dependencias externas
  serverExternalPackages: ['pdf-parse'],
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
