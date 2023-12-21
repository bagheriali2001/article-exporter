import { json } from '@sveltejs/kit';
import { sequelize, ExportQueue, Article, DbInit } from '$lib/server/DB'
import { startExporting, exportingStatus } from '$lib/server/Scheduler'

if (exportingStatus() === "Inactive") {
	startExporting();
}

export async function POST({ request, url }) {
	DbInit();
	try {
		let { fetch_url, email } = await request.json();
		
		if (!fetch_url) {
			return json({ error: "fetch_url_required" }, { status: 400 });
		} else if (typeof fetch_url !== "string") {
			return json({ error: "fetch_url_not_string" }, { status: 400 });
		} else if (!fetch_url.startsWith("https://www.scientificamerican.com/article/")) {
			return json({ error: "fetch_url_not_valid" }, { status: 400 });
		}

		fetch_url = fetch_url.trim();
		
		if (fetch_url.endsWith("/")) {
			fetch_url = fetch_url.slice(0, -1);
		}
		
		const queue_already_exists = await ExportQueue.findOne({
			where: {
				url: fetch_url
			}
		});
		const article_already_exists = await Article.findOne({
			where: {
				url: fetch_url
			}
		});
	
		if (article_already_exists) {
			return json({ id: article_already_exists.id, type: 'Article' }, { status: 200 });
		} else if (queue_already_exists) {
			return json({ id: queue_already_exists.id, type: 'ExportQueue' }, { status: 200 });
		} else {
			const new_queue_item = await ExportQueue.create({
				url: fetch_url,
				...(email ? { emails: JSON.stringify([email]) } : {})
			});

			return json({ id: new_queue_item.id, type: 'AddedToExportQueue' }, { status: 201 });
		}
	} catch (error) {
		console.error("Error:", error);
		return json({ error: error }, { status: 500 });
	}
}

export async function GET({ url }) {
	DbInit();
	try {
		const website = url.searchParams.get('website');
		const article_url = url.searchParams.get('article_url');
		const category = url.searchParams.get('category');
		const name = url.searchParams.get('name');
	
		const articles = await Article.findAll({
			where: {
				...(website ? { website: website } : {}),
				...(article_url ? { url: article_url } : {}),
				...(name ? { name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + name.toLowerCase() + '%') } : {}),
				...(category ? { categories: sequelize.where(sequelize.fn('LOWER', sequelize.col('categories')), 'LIKE', '%' + category.toLowerCase() + '%') } : {}),
			}
		});
		
		return json({articles});
	} catch (error) {
		console.error("Error:", error);
		return json({ error: error }, { status: 500 });
	}
}
