import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import AppLayout from "@/components/common/AppLayout";
import ThemeSwitcher from "@/components/providers/ThemeSwitcher";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const commonSEOconfig = {
	siteName: "Fazle Rabbi Faiyaz Portfolio",
	description:
		"Portfolio of Fazle Rabbi Faiyaz, a full-stack software developer",
	image: "/ogp-photo.jpg",
};

const appURL = process.env.NEXT_PUBLIC_APP_URL
	? new URL(process.env.NEXT_PUBLIC_APP_URL)
	: undefined;

export const metadata: Metadata = {
	metadataBase: appURL?.toString(),
	title: { default: "Faiyaz | Portfolio", template: "%s | Faiyaz" },
	description: "The portfolio of Fazle Rabbi Faiyaz.",
	openGraph: {
		type: "website",
		siteName: commonSEOconfig.siteName,
		description: commonSEOconfig.description,
		url: appURL?.toString(),
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

/** Renders the document shell with the persisted colour theme. */
export default async function RootLayout({
	children,
}: Readonly<React.PropsWithChildren>) {
	const theme = (await cookies()).get("app-theme")?.value;
	const isDarkMode = theme === "dark";

	return (
		<html
			lang="en"
			className={inter.variable}
			data-app-theme={isDarkMode ? "dark" : undefined}
		>
			<body>
				<ThemeSwitcher inDarkMode={isDarkMode}>
					<AppLayout>{children}</AppLayout>
				</ThemeSwitcher>
				<Toaster />
			</body>
		</html>
	);
}
