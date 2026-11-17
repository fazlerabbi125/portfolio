/** Represents the post fields required by a list card. */
export interface BlogPostListItem {
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

/** Represents one page returned by either post-list query. */
export interface PaginatedPosts {
	posts: BlogPostListItem[];
	total: number;
	totalPages: number;
	currentPage: number;
}
