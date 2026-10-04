import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import education from "@/data/education.json";

export default function EducationPage() {
	return (
		<section className="px-4 tablet:px-6 desktop:px-8 mx-auto w-[95%] min-w-[320px]">
			<h1 className="page-title text-center">Education</h1>
			<div className="timeline mt-5 mb-[4.5rem] flex flex-col gap-5">
				{education.map((entry) => (
					<Card
						className="timeline-item w-full min-w-0 max-w-[1420px] flex-none gap-0 p-0"
						data-date={entry.period}
						key={entry.title}
					>
						<CardContent className="space-y-3 p-6">
							<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
								<CardTitle className="text-lg font-semibold">
									{entry.title}
								</CardTitle>
								<p className="sr-only">{entry.period}</p>
							</div>
							<p className="text-sm">
								<span className="font-medium">{entry.institution}</span>
								<span className="text-muted-foreground">
									{" "}
									· {entry.location}
								</span>
							</p>
							<ul className="list-disc space-y-1 pl-5 text-sm">
								{entry.thesis && (
									<li>
										<strong>Thesis:</strong>{" "}
										{entry.thesis.link ? (
											<a
												href={entry.thesis.link}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-1 font-medium text-primary"
											>
												{entry.thesis.title}
												<ExternalLink size={14} aria-hidden="true" />
											</a>
										) : (
											entry.thesis.title
										)}
									</li>
								)}
								{entry.details.map((detail) => (
									<li key={detail}>{detail}</li>
								))}
							</ul>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
