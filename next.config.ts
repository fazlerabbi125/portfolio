import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "dummyimage.com" },
			{ protocol: "http", hostname: "dummyimage.com" },
		],
	},
};

export default nextConfig;
