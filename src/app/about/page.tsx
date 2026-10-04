import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import about from "@/data/about.json";

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
							<div className="flex flex-wrap gap-3 justify-center">
								{group.technologies.map((technology) => (
									<Card
										className="w-[150px] tablet:w-[200px] shrink-0 overflow-hidden p-0"
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
							</div>
						</Fragment>
					))}
				</div>
			</div>
			<div className="mt-6 mb-[4.5rem]">
				<h2 className="text-4xl font-semibold">Certifications</h2>
				<div className="mt-4 flex flex-col items-center gap-4">
					{about.certifications.map((certification) => (
						<Card
							key={certification.title}
							className="w-full min-w-[300px] max-w-[1420px] flex-none gap-0 p-0"
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
				</div>
			</div>
		</section>
	);
}
