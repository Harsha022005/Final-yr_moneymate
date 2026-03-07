import axios from "axios";

export async function sendTelegramAlert(chatId, message) {
    try {
        await axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            { chat_id: chatId, text: message }
        );
    } catch (err) {
        console.error("[TELEGRAM ERROR]", err.response?.data || err.message);
    }
}
