/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes a deployable site to /out
  output: "export",
  images: { unoptimized: true },
};
export default nextConfig;
