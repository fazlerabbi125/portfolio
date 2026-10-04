import * as z from "zod";

const contactSchema = z.object({
	name: z.string("Invalid data type").min(1, "Name is required"),
	email: z.email("Invalid email address"),
	subject: z
		.string("Invalid data type")
		.min(3, "Subject should be at least 3 characters long"),
	message: z
		.string("Invalid data type")
		.min(5, "Message should be at least 5 characters long"),
});

export default contactSchema;
