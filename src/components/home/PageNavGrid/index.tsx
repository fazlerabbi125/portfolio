import {
	BriefcaseBusiness,
	GraduationCap,
	Images,
	NotebookText,
	UserRound,
	Video,
} from "lucide-react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { NAVIGATION_LINKS } from "@/lib/constants";
import "./PageNavGrid.css";

const cardNavPages = {
	[NAVIGATION_LINKS.about.route]: {
		title: NAVIGATION_LINKS.about.label,
		description: "Learn more about me.",
		Icon: UserRound,
	},
	[NAVIGATION_LINKS.education.route]: {
		title: NAVIGATION_LINKS.education.label,
		description: "Check out my education qualifications.",
		Icon: GraduationCap,
	},
	[NAVIGATION_LINKS.workExperience.route]: {
		title: NAVIGATION_LINKS.workExperience.label,
		description: "Learn about my experiences in the industry.",
		Icon: BriefcaseBusiness,
	},
	[NAVIGATION_LINKS.pictureGallery.route]: {
		title: "Photo Gallery",
		description: "Browse moments from my photo gallery.",
		Icon: Images,
	},
	[NAVIGATION_LINKS.videoGallery.route]: {
		title: "Video Gallery",
		description: "Watch project demos and other videos I have shared.",
		Icon: Video,
	},
	[NAVIGATION_LINKS.blog.route]: {
		title: NAVIGATION_LINKS.blog.label,
		description: "Read my notes, ideas, and insights.",
		Icon: NotebookText,
	},
} as const;

export default function PageNavGrid() {
	return (
		<section className="page-nav-grid-container">
			<h2 className="text-2xl font-bold mb-6">Explore More</h2>
			<nav className="page-nav-grid" aria-label="Portfolio sections">
				{Object.entries(cardNavPages).map(
					([href, { title, description, Icon }]) => {
						return (
							<Link href={href} key={href} className="block rounded-2xl">
								<Card className="page-nav-card">
									<CardContent>
										<Icon className="page-nav-card__icon" aria-hidden="true" />
										<CardTitle>{title}</CardTitle>
										<CardDescription>{description}</CardDescription>
									</CardContent>
								</Card>
							</Link>
						);
					},
				)}
			</nav>
		</section>
	);
}
