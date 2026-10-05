import type { PropsWithChildren } from "react";
import { getCurrentUser } from "@/lib/session";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import "./AppLayout.css";

export default async function AppLayout({
	children,
}: Readonly<PropsWithChildren>) {
	const currentUser = await getCurrentUser();

	return (
		<div className="app-layout">
			<AppHeader currentUser={currentUser} />
			<main className="app-layout__main p-3">{children}</main>
			<AppFooter />
		</div>
	);
}
