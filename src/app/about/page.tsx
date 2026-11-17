import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import ScrollReveal from "@/components/common/ScrollReveal";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import about from "@/data/about.json";

/** Renders skills and professional certifications. */
export default function AboutPage() {
	const skillGroups = [
		{
			title: "Programming Languages",
			technologies: about.skills.programmingLanguages,
		},
		{
			title: "Full-Stack Development",
			technologies: about.skills.fullStackDevelopment,
		},
		{
			title: "Tools & DevOps",
			technologies: about.skills.toolsAndDevOps,
		},
	];

	return (
		<section className="px-4 tablet:px-6 desktop:px-8 mx-auto w-[95%] min-w-[320px]">
			<h1 className="page-title">About me</h1>
			<p className="whitespace-pre-wrap text-[17px]">{about.details}</p>
			<div className="mt-5">
				<h2 className="text-4xl font-semibold">Skills</h2>
				<div className="mt-3 flex flex-col gap-5">
					{skillGroups.map((group) => (
						<Fragment key={group.title}>
							<h3 className="text-2xl">{group.title}</h3>
							<ScrollReveal className="flex flex-wrap justify-center gap-3">
								{group.technologies.map((technology) => (
									<Card
										className="w-[150px] shrink-0 overflow-hidden p-0 tablet:w-[200px]"
										data-reveal-item
										key={technology.name}
									>
										<div className="flex aspect-square items-center p-5">
											<Image
												unoptimized
												src={technology.photo}
												alt=""
												width={32}
												height={32}
												className="h-full w-full object-contain"
											/>
										</div>
										<CardContent className="px-3 py-2 text-center text-sm">
											{technology.name}
										</CardContent>
									</Card>
								))}
							</ScrollReveal>
						</Fragment>
					))}
				</div>
			</div>
			<div className="mt-6 mb-[4.5rem]">
				<h2 className="text-4xl font-semibold">Certifications</h2>
				<ScrollReveal className="mt-4 flex flex-col items-center gap-4">
					{about.certifications.map((certification) => (
						<Card
							key={certification.title}
							className="w-full min-w-[300px] max-w-[1420px] flex-none gap-0 p-0"
							data-reveal-item
						>
							<CardHeader className="px-4 py-3">
								<CardTitle>{certification.title}</CardTitle>
								<CardDescription className="flex flex-col gap-[6px] text-sm">
									<div>{certification.provider}</div>
									<div>Issue {certification.date}</div>
								</CardDescription>
							</CardHeader>
							<CardContent className="gap-2 px-4 pb-4 pt-0">
								<p>{certification.description}</p>
								{"url" in certification && certification.url && (
									<a
										href={certification.url}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center gap-1 font-medium text-primary"
									>
										View certificate
										<ExternalLink size={14} aria-hidden="true" />
									</a>
								)}
							</CardContent>
						</Card>
					))}
				</ScrollReveal>
			</div>
		</section>
	);
}
