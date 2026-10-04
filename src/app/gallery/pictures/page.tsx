import PictureGrid from "@/components/gallery/PictureGrid";
export default function PicturesPage() {
	return (
		<>
			<div className="mt-3 text-center px-3">
				<h1 className="page-title">Pictures Gallery</h1>
				<p className="text-muted-foreground">
					A showcase of my favorite projects, creative work, and moments worth
					sharing.
				</p>
			</div>
			<PictureGrid />
		</>
	);
}
