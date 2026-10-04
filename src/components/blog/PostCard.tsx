"use client";

import { Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PostCardData {
	id: number;
	title: string;
	content?: string;
	createdAt: Date | string;
	categoryIds?: number[];
	category?: {
		id: number;
		name: string;
	}[];
}

interface PostCardProps {
	post: PostCardData;
}

export default function PostCard({ post }: Readonly<PostCardProps>) {
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(post.createdAt));

	return (
		<Link
			href={`/blog/${post.id}`}
			className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-transform hover:-translate-y-0.5"
		>
			<Card className="h-full border border-border bg-card transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md flex flex-col justify-between p-5">
				<CardHeader className="p-0 space-y-2">
					{post.category?.length ? (
						<div className="flex items-center gap-1.5">
							{post.category.map((category) => (
								<Badge
									key={category.id}
									variant="secondary"
									className="text-xs font-normal"
								>
									<Tag size={11} className="mr-1 inline opacity-70" />
									{category.name}
								</Badge>
							))}
						</div>
					) : null}
					<CardTitle className="post-card__title text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
						{post.title}
					</CardTitle>
					{post.content && (
						<p className="post-card__excerpt text-sm text-muted-foreground mt-2">
							{post.content}
						</p>
					)}
				</CardHeader>
				<CardContent className="p-0 pt-4 mt-auto">
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<Calendar size={13} className="opacity-70" />
							<time dateTime={new Date(post.createdAt).toISOString()}>
								{formattedDate}
							</time>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
