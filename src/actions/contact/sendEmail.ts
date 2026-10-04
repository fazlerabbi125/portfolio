"use server";

import { Resend } from "resend";

export async function sendEmail(input: { name: string; email: string; subject: string; message: string }) {
	const key = process.env.RESEND_API_KEY;
	const recipient = process.env.CONTACT_RECEIVER_EMAIL;
	if (!key || !recipient) return { ok: false, message: "Email delivery has not been configured yet." };
	try {
		await new Resend(key).emails.send({
			from: "Portfolio contact <onboarding@resend.dev>", // add prompt regarding this 
			to: recipient,
			replyTo: input.email,
			subject: input.subject,
			text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
		});
		return { ok: true, message: "Your message has been sent." };
	} catch {
		return { ok: false, message: "Your message could not be sent. Please try again later." };
	}
}
