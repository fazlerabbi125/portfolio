"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createCategory, deleteCategory, updateCategory } from "@/actions/blog";
import DeleteConfirmDialog from "@/components/blog/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { type CategoryInput, categorySchema } from "@/schemas/blog.schema";

interface Category {
	id: number;
	name: string;
	description?: string | null;
}

interface CategoryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
}

const emptyCategory: CategoryInput = {
	name: "",
	description: "",
};

export default function CategoryModal({
	open,
	onOpenChange,
	categories,
}: Readonly<CategoryModalProps>) {
	const router = useRouter();
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deletingCategory, setDeletingCategory] = useState<Category | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(
		null,
	);
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<CategoryInput>({
		resolver: zodResolver(categorySchema),
		mode: "onBlur",
		defaultValues: emptyCategory,
	});

	const startEditing = (cat: Category) => {
		setEditingCategory(cat);
		reset({
			name: cat.name,
			description: cat.description || "",
		});
		setMessage(null);
	};

	const cancelEditing = () => {
		setEditingCategory(null);
		reset(emptyCategory);
		setMessage(null);
	};

	const onSubmit = async (values: CategoryInput) => {
		setIsSubmitting(true);
		setMessage(null);

		const result = editingCategory
			? await updateCategory(editingCategory.id, values)
			: await createCategory(values);

		setIsSubmitting(false);

		if (result.ok) {
			setMessage({ text: result.message, ok: true });
			reset(emptyCategory);
			setEditingCategory(null);
			reset(emptyCategory);
			watch("name");
		} else {
			setMessage({ text: result.message, ok: false });
		}
	};

	const handleDelete = async () => {
		if (!deletingCategory) return;
		setIsSubmitting(true);
		const result = await deleteCategory(deletingCategory.id);
		setIsSubmitting(false);
		setDeletingCategory(null);

		if (result.ok) {
			setMessage({ text: result.message, ok: true });
			router.refresh();
		} else {
			setMessage({ text: result.message, ok: false });
		}
	};

	useEffect(() => {
		if (!open) reset(emptyCategory);
	}, [open, reset]);

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-lg" initialFocus={false}>
					<DialogHeader>
						<DialogTitle>Manage Categories</DialogTitle>
						<DialogDescription>
							Add, edit, or remove categories for blog articles.
						</DialogDescription>
					</DialogHeader>

					{message && (
						<p
							className={`text-sm p-3 rounded-md font-medium ${
								message.ok
									? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
									: "bg-destructive/10 text-destructive"
							}`}
							aria-live="polite"
						>
							{message.text}
						</p>
					)}

					{/* Form to Add or Edit Category */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="p-4 rounded-lg border border-border bg-card space-y-3"
					>
						<h3 className="font-semibold text-sm">
							{editingCategory
								? `Edit: ${editingCategory.name}`
								: "Add New Category"}
						</h3>
						<div>
							<label
								htmlFor="cat-name"
								data-required="true"
								className="block text-xs font-medium mb-1"
							>
								Name
							</label>
							<input
								id="cat-name"
								type="text"
								className="w-full px-3 py-1.5 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="e.g. Backend, Frontend, DevOps"
								{...register("name")}
							/>
							{errors.name && (
								<div className="text-xs text-destructive mt-1 error">
									{errors.name.message}
								</div>
							)}
						</div>

						<div>
							<label
								htmlFor="cat-desc"
								className="block text-xs font-medium mb-1"
							>
								Description
							</label>
							<input
								id="cat-desc"
								type="text"
								className="w-full px-3 py-1.5 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="Brief summary of this topic"
								{...register("description")}
							/>
							{errors.description && (
								<div className="text-xs text-destructive mt-1 error">
									{errors.description.message}
								</div>
							)}
						</div>

						<div className="flex gap-2 justify-end pt-1">
							{editingCategory && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={cancelEditing}
									disabled={isSubmitting}
								>
									Cancel Edit
								</Button>
							)}
							<Button type="submit" size="sm" disabled={isSubmitting}>
								{editingCategory ? (
									isSubmitting ? (
										"Updating…"
									) : (
										"Update Category"
									)
								) : (
									<>
										<Plus size={14} className="mr-1 inline" />
										{isSubmitting ? "Adding…" : "Add Category"}
									</>
								)}
							</Button>
						</div>
					</form>

					{/* Categories List */}
					<div className="space-y-2 max-h-60 overflow-y-auto pr-1">
						<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Existing Categories ({categories.length})
						</h4>
						{categories.length === 0 ? (
							<p className="text-xs text-muted-foreground py-2 text-center">
								No categories created yet.
							</p>
						) : (
							categories.map((cat) => (
								<div
									key={cat.id}
									className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface/50 text-sm hover:bg-muted/40 transition-colors"
								>
									<div>
										<span className="font-medium text-foreground">
											{cat.name}
										</span>
										{cat.description && (
											<p className="text-xs text-muted-foreground">
												{cat.description}
											</p>
										)}
									</div>
									<div className="flex items-center gap-1">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label={`Edit ${cat.name}`}
											onClick={() => startEditing(cat)}
										>
											<Pencil size={14} />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											className="text-destructive hover:bg-destructive/10"
											aria-label={`Delete ${cat.name}`}
											onClick={() => setDeletingCategory(cat)}
										>
											<Trash2 size={14} />
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Category Deletion Confirmation Modal */}
			<DeleteConfirmDialog
				open={!!deletingCategory}
				onOpenChange={(isOpen) => !isOpen && setDeletingCategory(null)}
				title={
					deletingCategory
						? `Delete Category "${deletingCategory.name}"?`
						: "Delete Category"
				}
				description="Any posts attached to this category will no longer include it. This action cannot be undone."
				onConfirm={handleDelete}
				isDeleting={isSubmitting}
			/>
		</>
	);
}
