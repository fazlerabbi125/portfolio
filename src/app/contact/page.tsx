import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
	return (
		<>
			<h1 className="page-title text-center px-2 !mt-5">Contact</h1>
			<p className="text-muted-foreground leading-[1.5] text-center px-2">Have a question or want to work together? Feel free to get in touch.</p>
			<ContactForm />
		</>
	);
}
