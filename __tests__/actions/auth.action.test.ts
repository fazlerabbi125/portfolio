jest.mock("@/drizzle/db", () => ({ db: {} }));
jest.mock("@/lib/session", () => ({
	getSession: jest.fn(),
	requireAuth: jest.fn(),
	setSessionInfo: jest.fn(),
}));

import { changePassword, login, updateProfile } from "@/actions/auth.action";
import { requireAuth } from "@/lib/session";

const mockRequireAuth = jest.mocked(requireAuth);

/** Verifies authentication actions return safe failures before database work. */
describe("authentication actions", () => {
	beforeEach(() => {
		mockRequireAuth.mockReset();
	});

	it("rejects invalid login input without querying the database", async () => {
		await expect(
			login({ email: "invalid", password: "" }),
		).resolves.toMatchObject({
			ok: false,
		});
	});

	it("returns a recoverable result when profile authentication expires", async () => {
		mockRequireAuth.mockRejectedValue(new Error("Unauthorized"));

		await expect(
			updateProfile({ name: "Fazle Rabbi", email: "fazle@example.com" }),
		).resolves.toEqual({
			ok: false,
			message: "Please log in to update your profile.",
		});
	});

	it("returns a recoverable result when password authentication expires", async () => {
		mockRequireAuth.mockRejectedValue(new Error("Unauthorized"));

		await expect(
			changePassword({
				currentPassword: "current-password",
				password: "new-password",
				confirmPassword: "new-password",
			}),
		).resolves.toEqual({
			ok: false,
			message: "Please log in to change your password.",
		});
	});
});
