import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    // The wishlist/favorites feature was removed. Send old bookmarks and
    // indexed URLs to the product catalog instead of a broken page.
    return [
      ...[
        "/wishlist",
        "/favorites",
        "/favourites",
        "/account/wishlist",
        "/account/favorites",
        "/account/favourites",
        "/reviews",
        "/reviews/:path*",
      ].map((source) => ({
        source,
        destination: "/products",
        permanent: true,
      })),
      {
        source: "/products/:id/reviews",
        destination: "/products/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
