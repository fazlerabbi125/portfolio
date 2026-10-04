import type { PropsWithChildren } from "react";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import "./AppLayout.css";

export default function AppLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<div className="app-layout">
			<AppHeader />
			<main className="app-layout__main p-3">{children}</main>
			<AppFooter />
		</div>
	);
}
