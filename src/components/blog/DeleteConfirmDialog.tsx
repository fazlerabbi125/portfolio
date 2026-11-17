"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	error?: string | null;
	onConfirm: () => void | Promise<void>;
	isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
	open,
	onOpenChange,
	title,
	description = "This action cannot be undone. Are you sure you want to proceed?",
	error,
	onConfirm,
	isDeleting = false,
}: DeleteConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{error && (
					<p
						className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive"
						aria-live="polite"
					>
						{error}
					</p>
				)}
				<DialogFooter>
					<Button
						variant="outline"
						type="button"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
						className="bg-red-500 text-white hover:bg-red-600"
					>
						{isDeleting ? "Deleting…" : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
