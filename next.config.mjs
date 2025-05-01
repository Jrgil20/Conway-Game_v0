/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  // Ajusta el basePath al nombre de tu repositorio (si lo sabes)
  // Por ejemplo: basePath: '/Conway-Game_v0',
  // Si no estás seguro, déjalo comentado y lo configuraremos después
  // basePath: '/Conway-Game_v0',
  // Asegúrate de que sea false para GitHub Pages
  trailingSlash: true,
}

export default nextConfig