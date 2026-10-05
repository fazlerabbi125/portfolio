export const SITE = {
	name: "Fazle Rabbi Faiyaz",
	photo: "/portofolio-photo.jpg",
	githubUrl: "https://github.com/fazlerabbi125",
	linkedinUrl: "https://linkedin.com/in/fazle-rabbi-faiyaz-5a0811222",
	resumeUrl: "https://canva.link/946kj9614r7937s",
} as const;

export const NAVIGATION_LINKS = {
	about: { label: "About", route: "/about" },
	education: { label: "Education", route: "/education" },
	workExperience: { label: "Work Experience", route: "/work-experience" },
	pictureGallery: { label: "Pictures", route: "/gallery/pictures" },
	videoGallery: { label: "Videos", route: "/gallery/videos" },
	blog: { label: "Blog", route: "/blog" },
	contact: { label: "Contact", route: "/contact" },
} as const satisfies Record<string, { label: string; route: string }>;

export enum USER_ROLES {
	ADMIN = "admin",
	USER = "user",
}

export const BLOG_POSTS = [
	"Designing accessible interfaces",
	"Keeping front-end systems maintainable",
	"Learning in public",
] as const;
