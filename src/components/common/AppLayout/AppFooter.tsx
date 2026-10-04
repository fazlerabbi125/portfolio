import { SITE } from "@/lib/constants";

export default function AppFooter() {
	return (
		<footer className="footer py-4 px-2">
			<div className="flex justify-center items-center">
				<span>© {new Date().getFullYear()} {SITE.name}. All Rights Reserved.</span>
			</div>
		</footer>
	);
}
