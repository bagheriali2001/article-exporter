import { ExportQueue, Article } from '$lib/server/DB'
import exportScientificAmerican from '$lib/server/exporters/ScientificAmerican'
import { sendEmail } from './services/EmailService';
import { BASE_URL } from '$env/static/private'

let isRunning = false;

async function exporting() {
    while (true){
        if (isRunning) {
            try {
                const startTime = new Date().getTime();
                const queue_size = await ExportQueue.count();
                console.log("Queue size:", queue_size);

                if(queue_size > 0) {
                    const queue_item = await ExportQueue.findOne({}, {
                        order: [
                            ['createdAt', 'ASC']
                        ]
                    });
                    if (queue_item) {
                        const article_already_exists = await Article.findOne({
                            where: {
                                url: queue_item.url
                            }
                        });
                        if (article_already_exists) {
                            await queue_item.destroy();
                            console.log("Already exist.");
                        } else {
                            // TODO: RUN THE EXPORTER HERE
                            const urlObject = new URL(queue_item.url);
                            const website = urlObject.hostname;

                            if (website === "www.scientificamerican.com") {
                                const {categories, slug, title, file_path_url} = await exportScientificAmerican(queue_item.url);

                                await Article.create({
                                    website: 'Scientific American',
                                    url: queue_item.url,
                                    name: title,
                                    categories: categories,
                                    files: [file_path_url]
                                });

                                console.log("Sending email...");
                                console.log("queue_item.email:", queue_item.emails);


                                if (queue_item.emails) {
                                    for (let email of queue_item.emails) {
                                        await sendEmail(email, {
                                            title: title,
                                            full_link: `${BASE_URL}${file_path_url}`
                                        });
                                    }
                                }

                                await queue_item.destroy();
                            }
                            console.log("Created.");
                        }
                    }
                }
            } catch (error) {
                console.error("ERROR in scheduler:", error);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

function startExporting() {
    if (!isRunning) {
        isRunning = true;
        console.log("Logging started.");
    } else {
        console.log("Logging is already running.");
    }
}

function stopExporting() {
    if (isRunning) {
        isRunning = false;
        console.log("Logging stopped.");
    } else {
        console.log("No active logging to stop.");
    }
}

function exportingStatus(): string {
    return isRunning ? "Active" : "Inactive";
}

exporting();

export { startExporting, stopExporting, exportingStatus }