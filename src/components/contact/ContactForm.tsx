"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sendEmail } from "@/actions/contact/sendEmail";
import { Button } from "@/components/ui/button";
import contactSchema from "@/schemas/contact.schema";
import "./ContactForm.css";

interface IContactFormInput {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export default function ContactForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<IContactFormInput>({
		mode: "onBlur",
		resolver: zodResolver(contactSchema),
	});
	const [message, setMessage] = useState("");
	const [isEmailError, setIsEmailError] = useState(false);
	const handleFormSubmit = async (values: IContactFormInput) => {
		const response = await sendEmail(values);
		setMessage(response.message);
		setIsEmailError(!response.ok);
	};

	return (
		<form
			className="contact-form rounded-md"
			onSubmit={handleSubmit(handleFormSubmit)}
			noValidate
		>
			{message && (
				<p
					className={cn(
						"contact-form__notice",
						isEmailError && "contact-form__notice--error",
					)}
				>
					{message}
				</p>
			)}
			<div className="contact-form-group">
				<label htmlFor="name" data-required="true">
					Full Name
				</label>
				<input id="name" {...register("name")} />
				{errors.name && <span className="error">{errors.name.message}</span>}
			</div>
			<div className="contact-form-group">
				<label htmlFor="email" data-required="true">
					Email
				</label>
				<input id="email" type="email" {...register("email")} />
				{errors.email && <span className="error">{errors.email.message}</span>}
			</div>
			<div className="contact-form-group">
				<label htmlFor="subject" data-required="true">
					Subject
				</label>
				<input id="subject" {...register("subject")} />
				{errors.subject && (
					<span className="error">{errors.subject.message}</span>
				)}
			</div>
			<div className="contact-form-group">
				<label htmlFor="message" data-required="true">
					Message
				</label>
				<textarea
					id="message"
					className="resize-none"
					rows={6}
					{...register("message")}
				/>
				{errors.message && (
					<span className="error">{errors.message.message}</span>
				)}
			</div>
			<Button type="submit" disabled={isSubmitting} className="mt-5">
				<Mail size={18} />
				{isSubmitting ? "Sending…" : "Send message"}
			</Button>
		</form>
	);
}
