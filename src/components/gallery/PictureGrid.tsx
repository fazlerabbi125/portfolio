"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PICTURE_GALLERY } from "@/lib/constants";
import "./Gallery.css";

export default function PictureGrid() {
	const [visibleCount, setVisibleCount] = useState(10);
	const [selected, setSelected] = useState<
		(typeof PICTURE_GALLERY)[number] | null
	>(null);

	return (
		<>
			<div className="gallery-grid">
				{PICTURE_GALLERY.slice(0, visibleCount).map((picture) => (
					<button
						className="gallery-grid__item"
						key={picture.title}
						type="button"
						onClick={() => setSelected(picture)}
					>
						<Card className="portfolio-card">
							<Image
								src={picture.url}
								alt={picture.title}
								width={800}
								height={600}
								sizes="(max-width: 700px) 100vw, 33vw"
								className="block"
							/>
							<div className="px-2">{picture.title}</div>
						</Card>
					</button>
				))}
			</div>
			{visibleCount < PICTURE_GALLERY.length && (
				<div className="gallery-load-more">
					<Button
						onClick={() =>
							setVisibleCount((count) =>
								Math.min(count + 8, PICTURE_GALLERY.length),
							)
						}
					>
						Load more pictures
					</Button>
				</div>
			)}
			<Dialog
				open={selected !== null}
				onOpenChange={(open) => !open && setSelected(null)}
			>
				<DialogContent className="share-modal picture-modal">
					<DialogHeader>
						<DialogTitle className="picture-modal__title">
							{selected?.title}
						</DialogTitle>
						<DialogDescription className="picture-modal__description">
							{selected?.description}
						</DialogDescription>
					</DialogHeader>
					{selected && (
						<Image
							className="picture-modal__image"
							src={selected.url}
							alt={selected.title}
							width={1600}
							height={1200}
							sizes="(max-width: 700px) 100vw, 760px"
						/>
					)}
					<DialogFooter>
						<DialogClose render={<Button variant="outline" />}>
							Close
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
