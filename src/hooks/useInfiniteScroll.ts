import { type RefObject, useEffect } from "react";

export function useInfiniteScroll(
	ref: RefObject<Element | null>,
	onIntersect: () => void,
) {
	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) onIntersect();
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, [onIntersect, ref]);
}
