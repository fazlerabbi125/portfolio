"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createPost, updatePost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { type PostInput, postSchema } from "@/schemas/blog.schema";

interface Category {
	id: number;
	name: string;
}

interface PostToEdit {
	id: number;
	title: string;
	content: string;
	imageURL?: string | null;
	categoryIds?: number[];
}

interface PostModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	initialPost?: PostToEdit | null;
	onSuccess?: () => void;
}

export default function PostModal({
	open,
	onOpenChange,
	categories,
	initialPost,
	onSuccess,
}: Readonly<PostModalProps>) {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const isEditing = !!initialPost;

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<PostInput>({
		resolver: zodResolver(postSchema),
		mode: "onBlur",
		defaultValues: {
			title: initialPost?.title || "",
			content: initialPost?.content || "",
			imageURL: initialPost?.imageURL || "",
			categoryIds: initialPost?.categoryIds ?? [],
		},
	});

	useEffect(() => {
		if (initialPost) {
			reset({
				title: initialPost.title,
				content: initialPost.content,
				imageURL: initialPost.imageURL || "",
				categoryIds: initialPost.categoryIds ?? [],
			});
		} else {
			reset({
				title: "",
				content: "",
				imageURL: "",
				categoryIds: [],
			});
		}
		setServerError(null);
	}, [initialPost, reset]);

	const onSubmit = async (values: PostInput) => {
		setServerError(null);
		const formattedValues: PostInput = {
			...values,
			imageURL: values.imageURL?.trim() || undefined,
			categoryIds: values.categoryIds,
		};

		const result = isEditing
			? await updatePost(initialPost.id, formattedValues)
			: await createPost(formattedValues);

		if (result.ok) {
			onOpenChange(false);
			reset();
			router.refresh();
			onSuccess?.();
		} else {
			setServerError(result.message);
		}
	};

	useEffect(() => {
		if (!open) reset();
	}, [open, reset]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Blog Post" : "Create New Post"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Make adjustments to your blog post and publish updates."
							: "Draft and publish a new article for your portfolio blog."}
					</DialogDescription>
				</DialogHeader>

				{serverError && (
					<p
						className="text-sm p-3 rounded-md bg-destructive/10 text-destructive font-medium"
						aria-live="polite"
					>
						{serverError}
					</p>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label
							htmlFor="post-title"
							data-required="true"
							className="block text-xs font-semibold uppercase tracking-wider mb-1"
						>
							Title
						</label>
						<input
							id="post-title"
							type="text"
							placeholder="Article title"
							className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							{...register("title")}
						/>
						{errors.title && (
							<div className="text-xs text-destructive mt-1 error">
								{errors.title.message}
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor="post-category"
							className="block text-xs font-semibold uppercase tracking-wider mb-1"
						>
							Category
						</label>
						<Controller
							name="categoryIds"
							control={control}
							render={({ field }) => (
								<select
									id="post-category"
									className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									multiple
									value={(field.value ?? []).map(String)}
									onChange={(event) => {
										field.onChange(
											Array.from(event.target.selectedOptions, (option) =>
												Number(option.value),
											),
										);
									}}
									onBlur={field.onBlur}
									name={field.name}
									ref={field.ref}
								>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</select>
							)}
						/>
						{errors.categoryIds && (
							<div className="text-xs text-destructive mt-1 error">
								{errors.categoryIds.message}
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor="post-image"
							className="block text-xs font-semibold uppercase tracking-wider mb-1"
						>
							Image URL
						</label>
						<input
							id="post-image"
							type="url"
							placeholder="https://example.com/cover.jpg"
							className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							{...register("imageURL")}
						/>
						{errors.imageURL && (
							<div className="text-xs text-destructive mt-1 error">
								{errors.imageURL.message}
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor="post-content"
							data-required="true"
							className="block text-xs font-semibold uppercase tracking-wider mb-1"
						>
							Content
						</label>
						<textarea
							id="post-content"
							rows={8}
							placeholder="Write your article markdown or formatted content here..."
							className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
							{...register("content")}
						/>
						{errors.content && (
							<div className="text-xs text-destructive mt-1 error">
								{errors.content.message}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? isEditing
									? "Saving…"
									: "Publishing…"
								: isEditing
									? "Save Changes"
									: "Publish Post"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
