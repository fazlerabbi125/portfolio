jest.mock("@/drizzle/db", () => ({ db: {} }));
jest.mock("@/lib/session", () => ({
	getCurrentUser: jest.fn(),
	requireAuth: jest.fn(),
}));
jest.mock("@/queries/blog.query", () => ({ attachCategories: jest.fn() }));

import { createPost, toggleFavorite } from "@/actions/blog.action";
import { USER_ROLES } from "@/lib/constants";
import { requireAuth } from "@/lib/session";

const mockRequireAuth = jest.mocked(requireAuth);

/** Verifies blog and favourite operations enforce their role boundaries. */
describe("blog actions", () => {
	beforeEach(() => {
		mockRequireAuth.mockReset();
	});

	it("rejects post creation for non-administrators", async () => {
		mockRequireAuth.mockResolvedValue({
			id: "user-1",
			name: "Reader",
			role: USER_ROLES.USER,
		});

		await expect(
			createPost({
				title: "Valid title",
				content: "A valid post body with enough content.",
			}),
		).resolves.toEqual({ ok: false, message: "Forbidden" });
	});

	it("rejects favourite changes for administrators", async () => {
		mockRequireAuth.mockResolvedValue({
			id: "admin-1",
			name: "Admin",
			role: USER_ROLES.ADMIN,
		});

		await expect(toggleFavorite(1)).resolves.toEqual({
			ok: false,
			favorited: false,
			message: "Forbidden",
		});
	});
});
