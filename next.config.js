/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Améliorer la prise en charge de l'App Router et des Server Components
  experimental: {
    // Activer les optimisations pour le routage et le rendu
    optimizeCss: true,
  },
  // Packages externes du serveur
  serverExternalPackages: [],
  // Améliorer la gestion des redirections
  poweredByHeader: false,
  // Configuration pour la compression
  compress: true,
  // Optimisation d'images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Ajouter une configuration de sécurité
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 