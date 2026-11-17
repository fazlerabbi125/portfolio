import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

jest.mock("@/components/home/HeroProfile", () => ({
	__esModule: true,
	default: () => <section aria-label="Hero profile" />,
}));

jest.mock("@/components/home/PageNavGrid", () => ({
	__esModule: true,
	default: () => <nav aria-label="Portfolio navigation" />,
}));

/** Verifies that the home route composes its two primary sections. */
describe("HomePage", () => {
	it("renders the home page sections", () => {
		render(<HomePage />);

		expect(screen.getByLabelText("Hero profile")).toBeInTheDocument();
		expect(screen.getByLabelText("Portfolio navigation")).toBeInTheDocument();
	});
});
