import { Card, CardContent, CardTitle } from "@/components/ui/card";
import experience from "@/data/experience.json";

export default function WorkExpPage() {
	return (
		<section className="px-4 tablet:px-6 desktop:px-8 mx-auto w-[95%] min-w-[320px]">
			<h1 className="page-title text-center">Work Experience</h1>
			<div className="timeline mt-6 mb-[4.5rem] flex flex-col gap-5">
				{experience.map((entry) => (
					<Card
						className="timeline-item w-full min-w-0 max-w-[1420px] flex-none gap-0 p-0"
						data-date={entry.period}
						key={`${entry.role} - ${entry.company} - ${entry.period}`}
					>
						<CardContent className="space-y-3 p-6">
							<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
								<CardTitle className="text-lg font-semibold">
									{entry.role}
								</CardTitle>
								<p className="sr-only">
									<time dateTime={entry.startDate}>
										{entry.period.split(" – ")[0]}
									</time>
									{" – "}
									<time dateTime={entry.endDate}>
										{entry.period.split(" – ")[1]}
									</time>
								</p>
							</div>
							<p className="text-sm">
								<a
									href={entry.website}
									target="_blank"
									rel="noreferrer"
									className="font-medium text-foreground underline-offset-4 hover:underline"
								>
									{entry.company}
								</a>
								<span className="text-muted-foreground">
									{" "}
									· {entry.location}
								</span>
							</p>
							<ul className="list-disc space-y-1 pl-5 text-sm">
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
