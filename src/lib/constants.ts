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

export const PICTURE_GALLERY = [
	{
		title: "City light at dusk",
		description: "Warm city lights begin to glow as evening settles in.",
		url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Mountain trail in spring",
		description: "A bright trail winding through fresh spring landscapes.",
		url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Quiet coast at sunrise",
		description: "Soft morning light rests over a calm coastal horizon.",
		url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Creative desk setup",
		description: "A tidy workspace prepared for focused creative work.",
		url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "City lights after rain",
		description: "Reflections shimmer across the city after a passing shower.",
		url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Mountain trail overlook",
		description: "A high trail opens onto a sweeping mountain view.",
		url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Quiet coast in blue hour",
		description: "The shoreline turns blue in the stillness before night.",
		url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Creative desk details",
		description: "Small details that give a creative workspace its character.",
		url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "City light reflections",
		description: "Urban color and light reflected in the evening streets.",
		url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Mountain trail through pines",
		description: "A quiet path travels beneath a canopy of tall pines.",
		url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Quiet coast and cliffs",
		description: "Rocky cliffs frame a peaceful stretch of open water.",
		url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Creative desk workspace",
		description: "An inviting desk designed for ideas, notes, and making.",
		url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "City light skyline",
		description: "A glowing skyline stretches across the late-day sky.",
		url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Mountain trail after rain",
		description: "Rain leaves the mountain path fresh, clear, and bright.",
		url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Quiet coast horizon",
		description: "A wide horizon brings a simple sense of calm.",
		url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Creative desk and notebook",
		description: "A notebook and open desk invite the next idea.",
		url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "City light midnight",
		description: "The city remains vivid beneath the deep midnight sky.",
		url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Mountain trail to the summit",
		description: "A challenging route leads toward a distant summit.",
		url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Quiet coast by the sea",
		description: "A restful coastal scene shaped by sky, water, and stone.",
		url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Creative desk in natural light",
		description: "Natural light fills a calm space made for thoughtful work.",
		url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
	},
];

export const BLOG_POSTS = [
	"Designing accessible interfaces",
	"Keeping front-end systems maintainable",
	"Learning in public",
] as const;
