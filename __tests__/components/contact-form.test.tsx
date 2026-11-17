import { fireEvent, render, screen } from "@testing-library/react";
import { sendEmail } from "@/actions/contact.action";
import ContactForm from "@/components/contact/ContactForm";

jest.mock("@/actions/contact.action", () => ({ sendEmail: jest.fn() }));

const mockSendEmail = jest.mocked(sendEmail);

/** Verifies contact submission presents the resolved delivery feedback. */
describe("ContactForm", () => {
	it("shows the successful delivery message", async () => {
		mockSendEmail.mockResolvedValue({
			ok: true,
			message: "Your message has been sent.",
		});
		render(<ContactForm />);

		fireEvent.change(screen.getByLabelText("Full Name"), {
			target: { value: "Fazle Rabbi" },
		});
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "fazle@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Subject"), {
			target: { value: "Portfolio enquiry" },
		});
		fireEvent.change(screen.getByLabelText("Message"), {
			target: { value: "Hello from a portfolio visitor." },
		});
		fireEvent.click(screen.getByRole("button", { name: "Send message" }));

		expect(
			await screen.findByText("Your message has been sent."),
		).toBeInTheDocument();
	});
});
