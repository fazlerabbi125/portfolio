"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { register } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { type RegisterInput, registerSchema } from "@/schemas/auth.schema";

interface RegistrationFormProps {
	onServerMessage: (msg: { text: string; ok: boolean } | null) => void;
	onSuccess?: () => void;
}

export default function RegistrationForm({
	onServerMessage,
	onSuccess,
}: Readonly<RegistrationFormProps>) {
	const {
		register: reg,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterInput>({
		mode: "onBlur",
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (values: RegisterInput) => {
		onServerMessage(null);
		const result = await register(values);
		if (result.ok) {
			onServerMessage({ text: result.message, ok: true });
			onSuccess?.();
			window.location.reload();
		} else {
			onServerMessage({ text: result.message, ok: false });
		}
	};

	return (
		<form
			className="auth-forms__form"
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<div className="auth-forms__group">
				<label htmlFor="reg-name" data-required="true">
					Full Name
				</label>
				<input id="reg-name" type="text" {...reg("name")} autoComplete="name" />
				{errors.name && <span className="error">{errors.name.message}</span>}
			</div>
			<div className="auth-forms__group">
				<label htmlFor="reg-email" data-required="true">
					Email
				</label>
				<input
					id="reg-email"
					type="email"
					{...reg("email")}
					autoComplete="email"
				/>
				{errors.email && <span className="error">{errors.email.message}</span>}
			</div>
			<div className="auth-forms__group">
				<label htmlFor="reg-password" data-required="true">
					Password
				</label>
				<input
					id="reg-password"
					type="password"
					{...reg("password")}
					autoComplete="new-password"
				/>
				{errors.password && (
					<span className="error">{errors.password.message}</span>
				)}
			</div>
			<div className="auth-forms__group">
				<label htmlFor="reg-confirm" data-required="true">
					Confirm Password
				</label>
				<input
					id="reg-confirm"
					type="password"
					{...reg("confirmPassword")}
					autoComplete="new-password"
				/>
				{errors.confirmPassword && (
					<span className="error">{errors.confirmPassword.message}</span>
				)}
			</div>
			<Button type="submit" disabled={isSubmitting} className="w-full mt-2">
				{isSubmitting ? "Creating account…" : "Create Account"}
			</Button>
		</form>
	);
}
