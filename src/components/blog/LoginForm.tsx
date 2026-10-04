"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { type LoginInput, loginSchema } from "@/schemas/auth.schema";

interface LoginFormProps {
	onServerMessage: (msg: { text: string; ok: boolean } | null) => void;
	onSuccess?: () => void;
}

export default function LoginForm({
	onServerMessage,
	onSuccess,
}: Readonly<LoginFormProps>) {
	const {
		register: reg,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		mode: "onBlur",
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (values: LoginInput) => {
		onServerMessage(null);
		const result = await login(values);
		if (result.ok) {
			onServerMessage({ text: result.message, ok: true });
			onSuccess?.();
			// Reload to refresh server session state across the page
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
				<label htmlFor="login-email" data-required="true">
					Email
				</label>
				<input
					id="login-email"
					type="email"
					{...reg("email")}
					autoComplete="email"
				/>
				{errors.email && <span className="error">{errors.email.message}</span>}
			</div>
			<div className="auth-forms__group">
				<label htmlFor="login-password" data-required="true">
					Password
				</label>
				<input
					id="login-password"
					type="password"
					{...reg("password")}
					autoComplete="current-password"
				/>
				{errors.password && (
					<span className="error">{errors.password.message}</span>
				)}
			</div>
			<Button type="submit" disabled={isSubmitting} className="w-full mt-2">
				{isSubmitting ? "Logging in…" : "Log In"}
			</Button>
		</form>
	);
}
