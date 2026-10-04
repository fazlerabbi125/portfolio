import VideoDisplay from "@/components/gallery/VideoDisplay";

export default function VideosPage() {
	return (
		<>
			<div className="mt-3 text-center px-3">
				<h1 className="page-title">Video Gallery</h1>
				<p className="text-muted-foreground">
					A collection of my videos on various topics, including tutorials, vlogs, and projects.
				</p>
			</div>
			<VideoDisplay />
		</>
	);
}
