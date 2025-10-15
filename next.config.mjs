/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
        "lh3.googleusercontent.com",
        "https://lh3.googleusercontent.com",
        "iglffttwjxwuvrpnwgks.supabase.co",
        "https://iglffttwjxwuvrpnwgks.supabase.co"
    ],
  },
  productionBrowserSourceMaps: true,
};
export default nextConfig;
