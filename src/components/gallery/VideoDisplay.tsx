"use client";
import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import VideoPlayer from "@/components/ui/video-player";
import videos from "@/data/videos.json";
import "./Gallery.css";

const perPage = 10;

export default function VideoDisplay() {
	const [active, setActive] = useState(0);
	const [visibleCount, setVisibleCount] = useState(perPage);
	const activeVideo = videos[active];

	return (
		<section className="video-display">
			<Card className="video-display-card gap-5">
				<VideoPlayer
					className="w-full aspect-video rounded-b-none"
					playerSettings={{
						src: activeVideo.url,
						autoplay: !process.env.NODE_ENV,
					}}
				/>
				<CardHeader>
					<CardTitle>{activeVideo.title}</CardTitle>
				</CardHeader>
				{activeVideo.description && (
					<CardContent>
						<CardDescription>{activeVideo.description}</CardDescription>
					</CardContent>
				)}
			</Card>

			<section className="video-display-playlist">
				{videos.slice(0, visibleCount).map((video, index) => (
					<Button
						key={video.url}
						variant="outline"
						className="video-playlist__item"
						disabled={index === active}
						onClick={() => setActive(index)}
					>
						<Play size={20} data-type="icon" />
						<span data-type="title">{video.title}</span>
						<span data-type="duration">Duration: {video.duration}</span>
					</Button>
				))}
			</section>
			{visibleCount < videos.length && (
				<div className="gallery-load-more">
					<Button
						onClick={() =>
							setVisibleCount((count) =>
								Math.min(count + perPage, videos.length),
							)
						}
					>
						Load more videos
					</Button>
				</div>
			)}
		</section>
	);
}
