import { json } from '@sveltejs/kit';
import { sequelize, ExportQueue, Article } from '$lib/server/DB'
import { startExporting, exportingStatus } from '$lib/server/Scheduler'

if (exportingStatus() === "Inactive") {
	startExporting();
}

export async function POST({ request, url }) {
	try {
		const { fetch_url, email } = await request.json();
		
		// fetch_url validation
		if (!fetch_url) {
			return json({ error: "The fetch_url is required" }, { status: 400 });
		} else if (typeof fetch_url !== "string") {
			return json({ error: "The fetch_url should be a string" }, { status: 400 });
		} else if (!fetch_url.startsWith("https://www.scientificamerican.com/article/")) {
			return json({ error: "The url should be a Scientific American article url !" }, { status: 400 });
		}
		
		const article_already_exists = await Article.findOne({
			where: {
				url: fetch_url
			}
		});
	
		if (article_already_exists) {
			return json({ id: article_already_exists.id, type: 'Article' }, { status: 200 });
		} else {
			// Can add email to emails of the queue too
			const queue_already_exists = await ExportQueue.findOne({
				where: {
					url: fetch_url
				}
			});
	
			if (queue_already_exists) {
				return json({ id: queue_already_exists.id, type: 'ExportQueue' }, { status: 200 });
			} else {
				const new_queue_item = await ExportQueue.create({
					url: fetch_url,
					...(email ? { emails: [email] } : {})
				});
	
				return json({ id: new_queue_item.id, type: 'AddedToExportQueue' }, { status: 201 });
			}
		}
	} catch (error) {
		console.error("Error:", error);
		return json({ error: error }, { status: 500 });
	}
}

export async function GET({ url }) {
	try {
		const article_website = url.searchParams.get('article_website');
		const article_url = url.searchParams.get('article_url');
		const article_category = url.searchParams.get('article_category');
		const article_name = url.searchParams.get('article_name');
	
	
		const articles = await Article.findAll({
			where: {
				...(article_website ? { website: article_website } : {}),
				...(article_url ? { url: article_url } : {}),
				...(article_name ? { name: article_name } : {}),
				...(article_category ? { categories: sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('categories'), article_category), true) } : {}),
			}
		});
		
		return json(articles);
	} catch (error) {
		console.error("Error:", error);
		return json({ error: error }, { status: 500 });
	}
}
