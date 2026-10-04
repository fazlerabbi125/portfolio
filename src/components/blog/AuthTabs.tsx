"use client";

import { cn } from "cn";
import { useState } from "react";
import LoginForm from "@/components/blog/LoginForm";
import RegistrationForm from "@/components/blog/RegistrationForm";
import "./AuthTabs.css";

type Tab = "login" | "register";

interface AuthTabsProps {
	onSuccess?: () => void;
}

export default function AuthTabs({ onSuccess }: Readonly<AuthTabsProps>) {
	const [activeTab, setActiveTab] = useState<Tab>("login");
	const [serverMessage, setServerMessage] = useState<{
		text: string;
		ok: boolean;
	} | null>(null);

	return (
		<div className="auth-forms">
			<div
				className="auth-forms__tabs"
				role="tablist"
				aria-label="Authentication"
			>
				<button
					role="tab"
					aria-selected={activeTab === "login"}
					className={cn(
						"auth-forms__tab",
						activeTab === "login" && "auth-forms__tab--active",
					)}
					onClick={() => {
						setActiveTab("login");
						setServerMessage(null);
					}}
					type="button"
				>
					Log In
				</button>
				<button
					role="tab"
					aria-selected={activeTab === "register"}
					className={cn(
						"auth-forms__tab",
						activeTab === "register" && "auth-forms__tab--active",
					)}
					onClick={() => {
						setActiveTab("register");
						setServerMessage(null);
					}}
					type="button"
				>
					Register
				</button>
			</div>

			{serverMessage && (
				<p
					className={cn(
						"auth-forms__notice",
						serverMessage.ok
							? "auth-forms__notice--success"
							: "auth-forms__notice--error",
					)}
					aria-live="polite"
				>
					{serverMessage.text}
				</p>
			)}

			{activeTab === "login" ? (
				<LoginForm onServerMessage={setServerMessage} onSuccess={onSuccess} />
			) : (
				<RegistrationForm
					onServerMessage={setServerMessage}
					onSuccess={onSuccess}
				/>
			)}
		</div>
	);
}
