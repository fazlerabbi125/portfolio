jest.mock("resend", () => ({
	Resend: jest.fn(),
}));

import { Resend } from "resend";
import { sendEmail } from "@/actions/contact.action";

const mockResend = jest.mocked(Resend);
const mockSend = jest.fn();

const validMessage = {
	name: "Fazle Rabbi",
	email: "fazle@example.com",
	subject: "Portfolio enquiry",
	message: "Hello from a portfolio visitor.",
};

/** Verifies Resend success and resolved error responses are surfaced safely. */
describe("sendEmail", () => {
	beforeEach(() => {
		process.env.RESEND_API_KEY = "test-key";
		process.env.CONTACT_RECEIVER_EMAIL = "recipient@example.com";
		mockResend.mockImplementation(
			() => ({ emails: { send: mockSend } }) as unknown as Resend,
		);
		mockSend.mockReset();
	});

	it("returns success when Resend accepts the message", async () => {
		mockSend.mockResolvedValue({ data: { id: "email-1" }, error: null });

		await expect(sendEmail(validMessage)).resolves.toEqual({
			ok: true,
			message: "Your message has been sent.",
		});
	});

	it("returns failure when Resend resolves with an error", async () => {
		mockSend.mockResolvedValue({ data: null, error: { message: "Rejected" } });

		await expect(sendEmail(validMessage)).resolves.toEqual({
			ok: false,
			message: "Your message could not be sent. Please try again later.",
		});
	});
});
