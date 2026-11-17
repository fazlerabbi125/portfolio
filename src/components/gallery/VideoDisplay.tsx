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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import VideoPlayer from "@/components/ui/video-player";
import videos from "@/data/videos.json";
import "./Gallery.css";

const pageSize = 10;

export default function VideoDisplay() {
	const [active, setActive] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const activeVideo = videos[active];
	const totalPages = Math.ceil(videos.length / pageSize);
	const currentVideos = videos.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

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
				{currentVideos.map((video) => {
					const videoIndex = videos.indexOf(video);
					return (
						<Button
							key={video.url}
							variant="outline"
							className="video-playlist__item"
							disabled={videoIndex === active}
							onClick={() => setActive(videoIndex)}
						>
							<Play size={20} data-type="icon" />
							<span data-type="title">{video.title}</span>
							<span data-type="duration">Duration: {video.duration}</span>
						</Button>
					);
				})}
			</section>
			<Pagination aria-label="Video gallery pagination">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#gallery-pagination"
							aria-disabled={currentPage === 1}
							tabIndex={currentPage === 1 ? -1 : undefined}
							className={
								currentPage === 1 ? "pointer-events-none opacity-50" : undefined
							}
							onClick={(event) => {
								event.preventDefault();
								setCurrentPage((page) => Math.max(1, page - 1));
							}}
						/>
					</PaginationItem>
					{Array.from({ length: totalPages }, (_, index) => index + 1).map(
						(page) => (
							<PaginationItem key={page}>
								<PaginationLink
									href="#gallery-pagination"
									isActive={page === currentPage}
									onClick={(event) => {
										event.preventDefault();
										setCurrentPage(page);
									}}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							href="#gallery-pagination"
							aria-disabled={currentPage === totalPages}
							tabIndex={currentPage === totalPages ? -1 : undefined}
							className={
								currentPage === totalPages
									? "pointer-events-none opacity-50"
									: undefined
							}
							onClick={(event) => {
								event.preventDefault();
								setCurrentPage((page) => Math.min(totalPages, page + 1));
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</section>
	);
}
