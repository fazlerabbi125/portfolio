"use client";

import { useRouter } from "next/navigation";
import {
	type SubmitEvent,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { changePassword, updateProfile } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

interface AccountSettingsDialogProps {
	name: string;
	email: string;
	profileOpen: boolean;
	passwordOpen: boolean;
	onProfileOpenChange: (open: boolean) => void;
	onPasswordOpenChange: (open: boolean) => void;
}

export default function AccountSettingsDialog({
	name,
	email,
	profileOpen,
	passwordOpen,
	onProfileOpenChange,
	onPasswordOpenChange,
}: Readonly<AccountSettingsDialogProps>) {
	const router = useRouter();
	const [profileName, setProfileName] = useState(name);
	const [profileEmail, setProfileEmail] = useState(email);
	const [profileError, setProfileError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const wasProfileOpen = useRef(false);
	const wasPasswordOpen = useRef(false);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (profileOpen && !wasProfileOpen.current) {
			setProfileName(name);
			setProfileEmail(email);
			setProfileError(null);
		}
		wasProfileOpen.current = profileOpen;
	}, [email, name, profileOpen]);

	useEffect(() => {
		if (passwordOpen && !wasPasswordOpen.current) {
			setPasswordError(null);
		}
		wasPasswordOpen.current = passwordOpen;
	}, [passwordOpen]);

	const submitProfile = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setProfileError(null);
		startTransition(async () => {
			try {
				const result = await updateProfile({
					name: profileName,
					email: profileEmail,
				});
				if (!result.ok) {
					setProfileError(result.message);
					return;
				}

				toast.add({ type: "success", description: result.message });
				onProfileOpenChange(false);
				router.refresh();
			} catch {
				setProfileError("Your profile could not be updated. Please try again.");
			}
		});
	};

	const submitPassword = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		setPasswordError(null);
		startTransition(async () => {
			try {
				const result = await changePassword({
					currentPassword: String(formData.get("currentPassword") ?? ""),
					password: String(formData.get("password") ?? ""),
					confirmPassword: String(formData.get("confirmPassword") ?? ""),
				});
				if (!result.ok) {
					setPasswordError(result.message);
					return;
				}

				toast.add({ type: "success", description: result.message });
				form.reset();
				onPasswordOpenChange(false);
			} catch {
				setPasswordError(
					"Your password could not be changed. Please try again.",
				);
			}
		});
	};

	return (
		<>
			<Dialog open={profileOpen} onOpenChange={onProfileOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update profile</DialogTitle>
						<DialogDescription>
							Change the name and email associated with your account.
						</DialogDescription>
					</DialogHeader>
					{profileError && (
						<p
							className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive"
							role="alert"
						>
							{profileError}
						</p>
					)}
					<form className="space-y-4" onSubmit={submitProfile}>
						<label className="grid gap-1.5 font-medium" htmlFor="profile-name">
							Name
							<input
								id="profile-name"
								value={profileName}
								onChange={(event) => setProfileName(event.target.value)}
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								autoComplete="name"
								required
							/>
						</label>
						<label className="grid gap-1.5 font-medium" htmlFor="profile-email">
							Email
							<input
								id="profile-email"
								type="email"
								value={profileEmail}
								onChange={(event) => setProfileEmail(event.target.value)}
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								autoComplete="email"
								required
							/>
						</label>
						<DialogFooter>
							<Button type="submit" disabled={isPending}>
								Save profile
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={passwordOpen} onOpenChange={onPasswordOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change password</DialogTitle>
						<DialogDescription>
							Your current password is required to continue.
						</DialogDescription>
					</DialogHeader>
					{passwordError && (
						<p
							className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive"
							role="alert"
						>
							{passwordError}
						</p>
					)}
					<form className="space-y-4" onSubmit={submitPassword}>
						{[
							["currentPassword", "Current password"],
							["password", "New password"],
							["confirmPassword", "Confirm new password"],
						].map(([field, label]) => (
							<label
								className="grid gap-1.5 font-medium"
								htmlFor={field}
								key={field}
							>
								{label}
								<input
									id={field}
									name={field}
									type="password"
									minLength={field === "currentPassword" ? undefined : 8}
									className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
									autoComplete={
										field === "currentPassword"
											? "current-password"
											: "new-password"
									}
									required
								/>
							</label>
						))}
						<DialogFooter>
							<Button type="submit" disabled={isPending}>
								Change password
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
