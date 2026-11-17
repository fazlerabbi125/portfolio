"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";

interface ScrollRevealProps {
	children: ReactNode;
	className?: string;
}

export default function ScrollReveal({
	children,
	className,
}: Readonly<ScrollRevealProps>) {
	const root = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const context = gsap.context(() => {
			const items =
				root.current?.querySelectorAll<HTMLElement>("[data-reveal-item]");
			if (!items?.length) return;

			gsap.from(items, {
				autoAlpha: 0,
				duration: 0.5,
				y: 20,
				stagger: 0.1,
				ease: "power2.out",
				scrollTrigger: {
					trigger: root.current,
					start: "top 82%",
					once: true,
				},
			});
		}, root);

		return () => context.revert();
	}, []);

	return (
		<div className={className} ref={root}>
			{children}
		</div>
	);
}
