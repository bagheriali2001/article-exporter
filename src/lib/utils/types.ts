export type Asset = string | { light: string; dark: string };

export interface Link {
	to: string;
	label: string;
	newTab?: boolean;
}

export type NavMenuItem = {
	title: string;
	to: string;
	icon: Asset;
}

export type Article = {
	id: string;
	name: string;
	url: string;
	website: string;
	categories: Array<string>;
	files: Array<string>;
	createdAt: string;
	updatedAt: string;
}