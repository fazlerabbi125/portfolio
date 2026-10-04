import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import "./HeroProfile.css";

export default function HeroProfile() {
	return (
		<section className="hero-section rounded-md py-7 px-6 mt-5">
			<div className="hero-section__content">
				<div className="text-[20px] italic font-semibold mb-1">Hello I'm</div>
				<h1 className="text-3xl font-bold">Fazle Rabbi Faiyaz</h1>
				<div className="text-[18px] mt-3 text-pretty">
					Full-stack developer with 4+ years of professional experience building
					software solutions to complex problems with modern web technologies.
				</div>
				<div className="mt-5 flex flex-wrap items-center gap-3">
					<Link
						href="/contact"
						className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
					>
						Contact Me
					</Link>
					<a
						href={SITE.resumeUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white"
					>
						View Resume
					</a>
					<a
						href={SITE.githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
						className="rounded-md p-2 hover:bg-muted"
					>
						<Image
							src="/icons/github.svg"
							width={27}
							height={27}
							alt="GitHub"
						/>
					</a>
					<a
						href={SITE.linkedinUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
						className="rounded-md p-2 hover:bg-muted"
					>
						<Image
							src="/icons/linkedin.svg"
							width={27}
							height={27}
							alt="LinkedIn"
						/>
					</a>
				</div>
			</div>
			<div className="hero-section__image-container">
				<Image
					src={SITE.photo}
					fill
					sizes="(max-width: 768px) 100vw, 40vw"
					priority
					alt={SITE.name}
					className="rounded-2xl"
				/>
			</div>
		</section>
	);
}
