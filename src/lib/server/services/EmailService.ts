import axios from "axios";
import { BASE_URL, MAILSENDER_EMAIL, MAILSENDER_API_TOKEN } from '$env/static/private'

const sendEmail = async (email: string, data: any) => {
    try {
        const textHTML = `
<h1>Your Article is Ready!</h1>
You requested to export the article <b>"${data.title}"</b>. <br>
You can download it from <a href="${data.full_link}">here</a>. <br>

If there is a problem with exported article, please notify us by sending a message through contact form in <a href="${BASE_URL}/feedback">Feedback form</a>. We will fix it as soon as possible, and notify you by email. If you have any other questions or suggestions, you can use the same form to contact us. <br>

If you found this website helpful, please consider donating to us to keep it running. You can donate via <a href="https://buymeacoffee.com/bagheriali2001">Buy Me a Coffee</a> or <a href="https://zarinp.al/bagheriali2001">ZarinPal</a> or you can donate to this USDT address: <b>T9zsTLCF3XW9po3NHnJ1a3ob2YqsccEE8s</b> in TRC20 network.`;

        await axios({
            method: "POST",
            url: "https://api.mailersend.com/v1/email",
            headers: {
                Authorization: `Bearer ${MAILSENDER_API_TOKEN}`,
            },
            data: {
                from: {
                    email: MAILSENDER_EMAIL,
                    name: "Article Exporter",
                },
                to: [
                    {
                        email: email,
                        name: email,
                    },
                ],
                subject: "Your Article is Ready!",
                html: textHTML,
            },
        });
    } catch (error) {
        console.log("Error in sending email: ", error)
        throw error;
    }
}

export { sendEmail };