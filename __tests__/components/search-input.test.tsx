import { fireEvent, render, screen } from "@testing-library/react";
import { SearchInput } from "@/components/ui/search-input";

/** Verifies that Enter-driven search is opt-in for reusable inputs. */
describe("SearchInput", () => {
	it("only invokes search on Enter when enabled", () => {
		const onSearch = jest.fn();
		const onValueChange = jest.fn();
		const { rerender } = render(
			<SearchInput
				aria-label="Search articles"
				onSearch={onSearch}
				onValueChange={onValueChange}
				value="portfolio"
			/>,
		);

		fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Enter" });
		expect(onSearch).not.toHaveBeenCalled();

		rerender(
			<SearchInput
				aria-label="Search articles"
				enableEnterPress
				onSearch={onSearch}
				onValueChange={onValueChange}
				value="portfolio"
			/>,
		);
		fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Enter" });

		expect(onSearch).toHaveBeenCalledWith("portfolio");
	});
});
