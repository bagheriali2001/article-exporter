import puppeteer from "puppeteer";
import fs from "fs";
import path from 'path'

const __dirname = path.resolve();

const extractCategory = async (text: string) => {
    text = text.replace(/^window.__DATA__=JSON.parse\(`/, "");
    text = text.replace(/`\)$/, "");
    text = text.replace(/\\\\/g, "\\");

    let json = JSON.parse(text);

    // initialData.article.primary_category
    // initialData.article.primary_category_slug
    // initialData.article.subcategory
    // initialData.article.subcategory_slug
    // initialData.article.categories
    // initialData.article.tags

    return {
        categories: json.initialData.article.categories,
        slug: json.initialData.article.slug,
        title: json.initialData.article.title
    };
}

const exportScientificAmerican = async (url: string) : Promise<{categories: string[], slug: string, title: string, file_path_url: string}> => {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-gpu',
            ]
        });

        const page = await (await browser).newPage();

        console.log("Going to:", url);
        await page.goto(url, { timeout: 0 });

        // find script with id __DATA__
        let script = await page.evaluate(() => {
            let script = document.getElementById('__DATA__');
            return script?.innerHTML;
        });

        let querySelectorToRemoveOthers = 'article';
        await page.evaluate((sel) => {
            var article = document.querySelector(sel);
            var article_parent = article?.parentNode;
            var article_parents_children = article_parent?.children || [];
            for(let i = 0; i < article_parents_children.length; i++){
                if(article_parents_children[i] !== article){
                    var parent = article_parents_children[i]?.parentNode;
                    if (parent) {
                        parent.removeChild(article_parents_children[i]);
                        i--;
                    }
                }
            }
        }, querySelectorToRemoveOthers);
        
        let {categories, slug, title} = await extractCategory(script||"");

        slug = slug.replace(/-/g, "_");

        if(!fs.existsSync(path.join(__dirname, `static/articles`))){
            fs.mkdirSync(path.join(__dirname, `static/articles`))
        }

        let file_path = path.join(__dirname, `static/articles/scientific_american-${slug}.pdf`);
        let file_path_url = `articles/scientific_american-${slug}.pdf`;
        while (fs.existsSync(file_path)) {
            if (file_path.match(/_\d\.pdf$/)) {
                let number = file_path.match(/_(\d)\.pdf$/)?.[1];
                if (number) {
                    let new_number = parseInt(number) + 1;
                    file_path = file_path.replace(/_\d\.pdf$/, `_${new_number}.pdf`);
                } else {
                    file_path = file_path.replace(/\.pdf$/, "_1.pdf");
                }
            } else {
                file_path = file_path.replace(/\.pdf$/, "_1.pdf");
            }
        }

        console.log("Saving to:", file_path);
        await page.pdf({
            path: file_path,
            format: 'A4',
            printBackground: true,
        });

        await (await browser).close();

        console.log('PDF generated successfully!');
        return {categories, slug, title, file_path_url};
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default exportScientificAmerican;
