import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import EducationPage from "@/app/education/page";
import PicturesPage from "@/app/gallery/pictures/page";
import VideosPage from "@/app/gallery/videos/page";
import WorkExperiencePage from "@/app/work-experience/page";

jest.mock("@/components/common/ScrollReveal", () => ({
	__esModule: true,
	default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/contact/ContactForm", () => ({
	__esModule: true,
	default: () => <form aria-label="Contact form" />,
}));

jest.mock("@/components/gallery/PictureGrid", () => ({
	__esModule: true,
	default: () => <div>Picture grid</div>,
}));

jest.mock("@/components/gallery/VideoDisplay", () => ({
	__esModule: true,
	default: () => <div>Video display</div>,
}));

/** Verifies that every synchronous public route exposes its main heading. */
describe("static pages", () => {
	it.each([
		["about", AboutPage, "About me"],
		["education", EducationPage, "Education"],
		["work experience", WorkExperiencePage, "Work Experience"],
		["contact", ContactPage, "Contact"],
		["pictures", PicturesPage, "Pictures Gallery"],
		["videos", VideosPage, "Video Gallery"],
	] as const)("renders the %s page heading", (_name, Page, heading) => {
		render(<Page />);

		expect(
			screen.getByRole("heading", { level: 1, name: heading }),
		).toBeInTheDocument();
	});
});
