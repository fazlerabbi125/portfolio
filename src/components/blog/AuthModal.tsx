"use client";

import AuthTabs from "@/components/blog/AuthTabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface AuthModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function AuthModal({
	open,
	onOpenChange,
}: Readonly<AuthModalProps>) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md p-6">
				<DialogHeader className="text-center">
					<DialogTitle className="text-xl font-bold">
						Sign In to Your Account
					</DialogTitle>
				</DialogHeader>
				<AuthTabs onSuccess={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
