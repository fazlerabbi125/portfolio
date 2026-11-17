import * as z from "zod";

export const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string("Invalid data type").min(1, "Password is required"),
});

export const registerSchema = z
	.object({
		name: z
			.string("Invalid data type")
			.min(2, "Name must be at least 2 characters"),
		email: z.email("Invalid email address"),
		password: z
			.string("Invalid data type")
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string("Invalid data type")
			.min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const updateProfileSchema = z.object({
	name: z
		.string("Invalid data type")
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(255, "Name must be 255 characters or fewer"),
	email: z.email("Invalid email address"),
});

export const changePasswordSchema = z
	.object({
		currentPassword: z
			.string("Invalid data type")
			.min(1, "Current password is required"),
		password: z
			.string("Invalid data type")
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string("Invalid data type")
			.min(1, "Please confirm your new password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
