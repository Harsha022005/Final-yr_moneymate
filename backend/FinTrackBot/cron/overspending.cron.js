import cron from "node-cron";
import { User } from "../models/schema.js";
import { detectOverspending } from "../services/overspending.service.js";
import { sendTelegramAlert } from "../services/telegram.service.js";

/* ---------- Centralized Cron ---------- */
export function startOverspendingCron() {
    // Runs every day at 01:00 AM server time
    cron.schedule("0 1 * * *", async () => {
        console.log("[CRON] Overspending check started");

        try {
            const users = await User.find(
                { expenses: { $exists: true, $ne: [] } },
                { telegramid: 1 }
            ).lean();

            for (const user of users) {
                try {
                   const result = await detectOverspending(user.telegramid, "monthly");

if (result) {
    const message = `
🚨 Overspending Alert

Expected: ₹${result.expectedSpend}
Actual: ₹${result.actualSpend}
Deviation: ${result.deviationPercent}%
Confidence: ${(result.confidence * 100).toFixed(0)}%
    `;

    await sendTelegramAlert(user.telegramid, message);
}
                } catch (err) {
                    console.error(
                        `[CRON] Failed for user ${user.telegramid}`,
                        err.message
                    );
                }
            }

            console.log("[CRON] Overspending check completed");
        } catch (err) {
            console.error("[CRON] Fatal error:", err);
        }
    });
}
