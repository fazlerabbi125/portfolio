import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/common/AppLayout";
import { Toaster } from "@/components/ui/toast";

// import ThemeSwitcher from "@/components/providers/ThemeSwitcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const commonSEOconfig = {
	siteName: "Fazle Rabbi Faiyaz Portfolio",
	description:
		"Portfolio of Fazle Rabbi Faiyaz, a full-stack software developer",
	image: '/ogp-photo.jpg',
};

export const metadata: Metadata = {
	metadataBase: process.env.NEXT_PUBLIC_APP_URL
		? new URL(process.env.NEXT_PUBLIC_APP_URL)
		: undefined,
	title: { default: "Faiyaz | Portfolio", template: "%s | Faiyaz" },
	description: "The portfolio of Fazle Rabbi Faiyaz.",
	openGraph: {
		type: "profile",
		siteName: commonSEOconfig.siteName,
		description: commonSEOconfig.description,
		images: [
			{
				url: commonSEOconfig.image,
				width: 1200,
				height: 630,
				alt: "My portfolio image",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: commonSEOconfig.siteName,
		description: commonSEOconfig.description,
		images: [commonSEOconfig.image],
	},
};

export default function RootLayout({
	children,
}: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="en" className={inter.variable}>
			<body>
				{/* <ThemeSwitcher> */}
				<AppLayout>{children}</AppLayout>
				{/* </ThemeSwitcher> */}
				<Toaster />
			</body>
		</html>
	);
}
