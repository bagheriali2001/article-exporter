import { json } from '@sveltejs/kit';
import { Article, DbInit } from '$lib/server/DB'

export async function GET() {
	DbInit();
	try {
		const articles = await Article.findAll({
			attributes: ["categories"],
		});

		let categories: string[] = [];
		for (let article of articles) {
			categories = categories.concat(article.categories);
		}
		categories = [...new Set(categories)];

		return json({categories});
	} catch (error) {
		console.error("Error:", error);
		return json({ error: error }, { status: 500 });
	}
}