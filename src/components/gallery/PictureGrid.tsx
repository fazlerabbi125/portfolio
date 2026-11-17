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
import pictures from "@/data/pictures.json";
import "./Gallery.css";

function PicturePreview({
	picture,
}: Readonly<{ picture: (typeof pictures)[number] }>) {
	return (
		<Image
			className="block"
			src={picture.url}
			alt={picture.title}
			width={800}
			height={600}
			sizes="(max-width: 700px) 100vw, 33vw"
			loading="lazy"
		/>
	);
}

export default function PictureGrid() {
	const [selected, setSelected] = useState<(typeof pictures)[number] | null>(
		null,
	);

	return (
		<>
			<div className="gallery-grid">
				{pictures.map((picture) => (
					<button
						className="gallery-grid__item"
						key={picture.title}
						type="button"
						onClick={() => setSelected(picture)}
					>
						<Card className="portfolio-card">
							<PicturePreview picture={picture} />
							<div className="px-2">{picture.title}</div>
						</Card>
					</button>
				))}
			</div>
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
							loading="lazy"
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
