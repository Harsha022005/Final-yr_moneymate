import { transcribeAudio } from '../services/voice.service.js';
import express from 'express';
import { User } from '../models/schema.js';
import { detectOverspending } from '../services/overspending.service.js';
import { getInvestmentRecommendation } from '../services/investment.service.js'; import { predictNextMonth } from '../services/futurePrediction.service.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function handletelegramupdates(msg) {
    const chatid = msg.chat.id || msg.update_id;
    const userid = msg.from.id;
    let text = msg.text ? msg.text.trim() : '';

    // 🎤 Handle Voice Messages
    if (msg.voice) {
        try {
            await sendtext(chatid, "🎤 Listening...");

            // 1. Get File Path from Telegram
            const fileResponse = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${msg.voice.file_id}`);
            const filePath = fileResponse.data.result.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;

            // 2. Transcribe
            const transcribedText = await transcribeAudio(fileUrl);

            if (transcribedText) {
                text = transcribedText.trim(); // Override text with voice content
                // Remove trailing punctuation (AssemblyAI adds periods)
                if (text.endsWith('.')) text = text.slice(0, -1);

                await sendtext(chatid, `🗣️ I heard: "${text}"`);
            } else {
                return sendtext(chatid, "❌ Sorry, I couldn't understand the audio.");
            }
        } catch (error) {
            console.error('[Voice Handler] Error:', error);
            return sendtext(chatid, "❌ Error processing voice message.");
        }
    }

    console.log('Received message:', msg);
    console.log('chatid:', chatid);
    console.log('userid:', userid);
    console.log('text:', text);

    if (text === '/start') {
        return sendtext(chatid, `
Welcome to Expense Tracker Bot!

Easily manage your finances with these commands:

- /setincome <amount> <category> - Set your income
- /addexpenses <amount> <category> - Log a new expense
- /todayexpenses - View today's expenses
- /weekly - See your weekly expense summary
- /monthly - See your monthly expense summary
- /addrecurringexpenses <amount> <category> <frequency> <duration> - Set recurring expenses
- /setreminder <amount> <category> <duration> [daily|weekly|monthly] - Set expense reminders
- /checkbalance - Check your current balance
- /overspending - Check for overspending alerts
- /predict - Predict your future expenses
- /botid - Get your unique Telegram ID for secure access
- /help - View all available commands

Your Telegram ID: \`${userid}\`
Use this ID to securely access your expenses on our website.
- /investment - Get personalized investment recommendations
Start tracking now and take control of your finances!
`);
    } else if (text === '/predict' || text === '/predict@YourBotName') {
        return await handleExpensePrediction(msg, text, userid, chatid);
    } else if (text === '/investment') {
        return await handleInvestmentCommand(msg, text, userid, chatid);
    } else if (text === '/botid') {
        return await handlebotid(msg, text, userid, chatid);
    } else if (text === '/help') {
        return sendtext(chatid, `
Expense Tracker Bot Commands

Manage your finances effortlessly:
- /start - Get started with the bot
- /setincome <amount> <category> - Set your income
- /investment - Get personalized investment recommendations
- /addexpenses <amount> <category> - Add an expense (e.g., /addexpenses 50 coffee)
- /todayexpenses - View today's expenses
- /weekly - Weekly expense summary
- /monthly - Monthly expense summary
- /addrecurringexpenses <amount> <category> <frequency> <duration> - Add recurring expenses (e.g., /addrecurringexpenses 100 rent monthly 6)
- /setreminder <amount> <category> <duration> [daily|weekly|monthly] - Set reminders (e.g., /setreminder 100 groceries 3 weekly)
- /checkbalance - Check your current balance
- /overspending - Check for overspending alerts
- /predict - Predict your future expenses
- /botid - Get your Telegram ID for secure website access
- /help - Show this menu

Start tracking your expenses today!
`);
    } else if (text.startsWith('/setincome')) {
        return await handlesetincome(msg, text, userid, chatid);
    } else if (text === '/checkbalance') {
        return await handlecheckbalance(msg, text, userid, chatid);
    } else if (text.startsWith('/addrecurringexpenses')) {
        return await handleaddrecurringexpenses(msg, text, userid, chatid);
    } else if (text.startsWith('/addexpenses')) {
        return await handleaddexpenses(msg, text, userid, chatid);
    } else if (text === '/todayexpenses') {
        return await handletodayexpenses(msg, text, userid, chatid);
    } else if (text === '/weekly') {
        return await handleweeklyexpenses(msg, text, userid, chatid);
    } else if (text === '/monthly') {
        return await handlemonthlyexpenses(msg, text, userid, chatid);
    } else if (text.startsWith('/setreminder')) {
        return await handleReminders(msg, text, userid, chatid);
    } else if (text === '/overspending') {
        return await handleOverspending(msg, text, userid, chatid);
    }

    // 🗣️ Voice-friendly: Convert spoken numbers to digits
    else if (/^(hundred|fifty|twenty|thirty|forty|sixty|seventy|eighty|ninety|thousand|one|two|three|four|five|six|seven|eight|nine|ten)\s+/i.test(text)) {
        console.log('[VOICE MAGIC] Detected spoken number pattern');
        const convertedText = convertSpokenNumberToDigit(text);
        console.log('[VOICE MAGIC] Converted to:', convertedText);
        const modifiedText = `/addexpenses ${convertedText}`;
        return await handleaddexpenses({ ...msg, text: modifiedText }, modifiedText, userid, chatid);
    }

    // ✨ Magic Command: "50 coffee" -> Auto Adds Expense
    else if (/^\d+(\.\d+)?\s+.+$/.test(text)) {
        console.log('[MAGIC COMMAND] Detected expense pattern');
        // Prepend command to reuse existing handler logic
        const modifiedText = `/addexpenses ${text}`;
        return await handleaddexpenses({ ...msg, text: modifiedText }, modifiedText, userid, chatid);
    }

    else {
        return sendtext(chatid, `
Invalid Command

Please use a valid command. Type /help to see all available commands.
`);
    }
}

// Helper: Convert spoken numbers to digits
function convertSpokenNumberToDigit(text) {
    const numberMap = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
        'twenty': '20', 'thirty': '30', 'forty': '40', 'fifty': '50',
        'sixty': '60', 'seventy': '70', 'eighty': '80', 'ninety': '90',
        'hundred': '100', 'thousand': '1000'
    };

    const words = text.split(' ');
    const firstWord = words[0].toLowerCase();

    if (numberMap[firstWord]) {
        words[0] = numberMap[firstWord];
        return words.join(' ');
    }

    return text;
}

async function handlebotid(msg, text, userid, chatid) {
    const url = process.env.DASHBOARD_URL || "https://fintrackbotwebsite-7iqj.vercel.app/";
    const message = `
🆔 Your Telegram ID: \`${userid}\`

🔗 [Access Your Dashboard](${url})

Use this ID to securely view and manage your expenses on our website. Keep it private for your security!
`;
    return sendtext(chatid, message);
}
// In handlesetincome function
async function handlesetincome(msg, text, userid, chatid) {
    const parts = text.split(' ');
    if (parts.length < 3) {
        return sendtext(chatid, `
Invalid Format
Please use: /setincome <amount> <category>
Example: /setincome 50 salary
`);
    }
    const amount = parseFloat(parts[1]);
    const category = parts.slice(2).join(' ');

    if (isNaN(amount) || amount < 0) {
        return sendtext(chatid, `
Invalid Amount
Please enter a valid number for the amount.
Example: /setincome 50000 salary
`);
    }

    try {
        let user = await User.findOne({ telegramid: userid });
        if (!user) {
            user = new User({
                telegramid: userid,
                name: msg.from.first_name,
                username: msg.from.username,
                incomes: [{ amount, category, date: new Date() }],
                expenses: []
            });
        } else {
            user.incomes.push({ amount, category, date: new Date() });
        }

        await user.save();
        console.log('Income updated successfully:', user);
        return sendtext(chatid, `
✅ Income Updated!
- Amount: ₹${amount.toFixed(2)}
- Category: ${category}
You can check your balance with /checkbalance
`);
    } catch (err) {
        console.error('Error saving income:', err);
        return sendtext(chatid, `
❌ Error
Could not save your income. Please try again later.
`);
    }
}

// In handlecheckbalance function
async function handlecheckbalance(msg, text, userid, chatid) {
    try {
        const user = await User.findOne({ telegramid: userid });
        if (!user) {
            return sendtext(chatid, '❌ User not found. Please set your income first using /setincome.');
        }

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Calculate monthly expenses
        const monthlyExpenses = user.expenses.filter(exp => {
            const d = new Date(exp.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const totalMonthlyExpenses = monthlyExpenses.reduce((total, expense) => total + (expense.amount || 0), 0);

        // Calculate monthly income from history
        const monthlyIncomes = user.incomes.filter(inc => {
            const d = new Date(inc.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        const totalIncome = monthlyIncomes.reduce((total, inc) => total + (inc.amount || 0), 0);

        const balance = totalIncome - totalMonthlyExpenses;

        // Format the response
        const message = `
💰 *Balance Summary* 💰
------------------------
💵 *Total Income*: ₹${totalIncome.toFixed(2)}
💸 *Monthly Expenses*: ₹${totalMonthlyExpenses.toFixed(2)}
------------------------
✅ *Remaining Balance*: ₹${balance.toFixed(2)}
`;

        return sendtext(chatid, message);
    } catch (err) {
        console.error('Error in check balance:', err);
        return sendtext(chatid, '❌ Error fetching your balance. Please try again later.');
    }
}
// Handle overspending
// Handle overspending
// In Telegramhandler.js, update the handleOverspending function
async function handleOverspending(msg, text, userid, chatid) {
    try {
        const result = await detectOverspending(userid);

        if (!result) {
            return sendtext(chatid,
                '❌ Could not analyze spending. Please make sure you have added some expenses.'
            );
        }

        // Handle case when income is not set
        if (result.reason?.includes("Please set your monthly income")) {
            return sendtext(chatid,
                `📊 Budget Setup Required\n\n` +
                `To help you track overspending, please set your monthly income using:\n` +
                `/setincome [amount]`
            );
        }

        // Handle 60-20-20 rule response
        if (result.usingBudgetRule) {
            if (result.isOverspending) {
                return sendtext(chatid,
                    `⚠️ Budget Alert (60-20-20 Rule)

Your expenses (₹${result.actualSpend.toFixed(2)}) have exceeded 60% of your monthly income (₹${result.monthlyIncome.toFixed(2)}).
Budget Limit (60%): ₹${result.expectedSpend.toFixed(2)}

📊 You've spent ${result.deviationPercent.toFixed(1)}% over your recommended budget.

💡 Recommendation:
- Review your recent expenses
- Try to reduce spending in non-essential categories
- Aim to save at least 20% of your income`);
            } else {
                return sendtext(chatid,
                    `✅ Budget on Track (60-20-20 Rule)

Your current spending (₹${result.actualSpend.toFixed(2)}) is within the recommended 60% of your income (₹${result.monthlyIncome.toFixed(2)}).
Budget Limit (60%): ₹${result.expectedSpend.toFixed(2)}

💰 Remaining this month: ₹${(result.expectedSpend - result.actualSpend).toFixed(2)}

Keep up the good work! Consider saving any remaining amount.`);
            }
        }

        // Handle statistical model results (only used when no income is set)
        if (!result.isOverspending) {
            return sendtext(chatid,
                `✅ Spending on Track!

Your current spending (₹${result.actualSpend.toFixed(2)}) is within your normal range.
Average Monthly Spend: ₹${result.expectedSpend.toFixed(2)}

💡 Tip: Set your monthly income with /setincome to enable budget-based spending alerts.`);
        }

        // Handle overspending detected by statistical model
        const deviationAmount = result.actualSpend - result.expectedSpend;
        return sendtext(chatid,
            `⚠️ Overspending Detected (Statistical Analysis)

Expected: ₹${result.expectedSpend.toFixed(2)}
Actual: ₹${result.actualSpend.toFixed(2)}

📈 Overspent: ₹${deviationAmount.toFixed(2)}
📊 Increase: ${result.deviationPercent.toFixed(1)}%

💡 Recommendation:
Your spending is higher than your historical patterns. Consider reviewing recent expenses.

💡 Tip: Set your monthly income with /setincome to enable budget-based spending alerts.`);

    } catch (err) {
        console.error('Error in overspending check:', err);
        return sendtext(chatid,
            '❌ Error checking for overspending. Please try again later.\n' +
            'If the issue persists, contact support.'
        );
    }
}

// Handle expense prediction
async function handleExpensePrediction(msg, text, userid, chatid) {
    try {
        // Get user's expense history
        const user = await User.findOne({ telegramid: userid });
        if (!user) {
            return sendtext(chatid, "❌ User not found. Please use /start to register first.");
        }

        // Get all expenses
        const expenses = user.expenses || [];

        if (expenses.length === 0) {
            return sendtext(chatid, "📊 You don't have any expenses yet. Start adding expenses to get predictions.");
        }

        // Get prediction
        const prediction = predictNextMonth(expenses);

        // Format response
        let response = `📈 *Expense Prediction for Next Month*\n\n`;
        response += `💰 *Predicted Amount*: ₹${prediction.prediction.toLocaleString()}\n`;
        response += `📊 *Confidence*: ${Math.round(prediction.confidence * 100)}%\n\n`;

        if (prediction.confidence < 0.5) {
            response += "ℹ️ *Note*: This is a rough estimate. More data will improve accuracy.";
        } else if (prediction.confidence > 0.8) {
            response += "✅ *High confidence prediction* based on your spending patterns.";
        }

        return sendtext(chatid, response);

    } catch (error) {
        console.error('Prediction error:', error);
        return sendtext(chatid, "❌ Error generating prediction. Please try again later.");
    }
}
// Handle investment recomendation engine

// In Telegramhandler.js, update the handleInvestmentCommand function
// In Telegramhandler.js, update the handleInvestmentCommand function
export async function handleInvestmentCommand(msg, text, userid, chatid) {
    try {
        // Get the investment recommendation
        const recommendation = await getInvestmentRecommendation(userid);

        if (!recommendation) {
            return sendtext(chatid, '❌ Could not generate investment recommendation. Please ensure you have set your income and have some expense history.');
        }

        const { amount, safeAmount, riskProfile, confidence, explanation, financialSnapshot } = recommendation;

        // Format the response message
        const message = `
🤖 *AI Investment Suggestion* 🚀

*Strategy*: ${riskProfile} (Confidence: ${Math.round((confidence || 0) * 100)}%)

💰 *Recommended Range:*
🛡️ *Safe:* ₹${(safeAmount || 0).toLocaleString('en-IN')}
🚀 *Target:* ₹${(amount || 0).toLocaleString('en-IN')}

*Why these amounts?*
${explanation}

📊 *Current Snapshot:*
- Income: ₹${financialSnapshot?.monthlyIncome?.toLocaleString('en-IN') || '0'}
- Avg. Spend: ₹${financialSnapshot?.avgMonthlySpend?.toLocaleString('en-IN') || '0'}
- Savings Rate: ${financialSnapshot?.savingsRate || 0}%

💡 *Real-World Tip:*
The 50/30/20 rule is just a guide. If you're just starting, try the *Safe* amount first. Once you have 3-6 months of expenses saved as an "Emergency Fund", you can push towards the *Target*!
        `;

        return sendtext(chatid, message);

    } catch (error) {
        console.error('Error in handleInvestmentCommand:', error);
        return sendtext(chatid, '❌ An error occurred while processing your request. Please try again later.');
    }
}


// Handle add expenses
async function handleaddexpenses(msg, text, userid, chatid) {
    const parts = text.split(' ');
    if (parts.length < 3) {
        return sendtext(chatid, `
Invalid Format
Please use: /addexpenses <amount> <category> from local host
Example: /addexpenses 50 coffee 
`);
    }
    const amount = parseFloat(parts[1]);
    const category = parts.slice(2).join(' ');
    if (isNaN(amount) || amount < 0) {
        return sendtext(chatid, `
Invalid Amount
Please enter a valid number for the amount.
Example: /addexpenses 50 coffee
`);
    }

    let user = await User.findOne({ telegramid: userid });
    if (!user) {
        user = new User({
            telegramid: userid,
            name: msg.from.first_name,
            username: msg.from.username,
            expenses: [],
        });
    }

    user.expenses.push({
        amount,
        category,
        date: new Date()
    });

    try {
        await user.save();
        console.log('Expense saved successfully:', user);
        await sendtext(chatid, `
Expense Added!
- Amount: ₹${amount}
- Category: ${category}
Track more expenses with /addexpenses!
`);

        // Real-time overspending check
        const overspendingResult = await detectOverspending(userid, 'monthly', user);

        if (overspendingResult && overspendingResult.isOverspending) {
            const alertMessage = `
🚨 *Immediate Overspending Alert*

You've just crossed your budget threshold!
Expected: ₹${overspendingResult.expectedSpend.toFixed(2)}
Actual: ₹${overspendingResult.actualSpend.toFixed(2)}

⚠️ Deviation: ${overspendingResult.deviationPercent.toFixed(1)}%
`;
            await sendtext(chatid, alertMessage);
        }

    } catch (err) {
        console.error('Error saving expense:', err);
        return sendtext(chatid, `
            Error
Could not save your expense.Please try again later.
`);
    }
}


async function handleaddrecurringexpenses(msg, text, userid, chatid) {
    const parts = text.split(' ');
    if (parts.length < 5) {
        return sendtext(chatid, `
Invalid Format 
Please use: /addrecurringexpenses <amount> <category> <frequency> <duration>
            Example: /addrecurringexpenses 100 rent monthly 6
                `);
    }
    const amount = parseFloat(parts[1]);
    const category = parts[2];
    const frequency = parts[3].toLowerCase();
    const duration = parseInt(parts[4]);

    const validFrequencies = ['daily', 'weekly', 'monthly'];
    if (isNaN(amount) || amount <= 0) {
        return sendtext(chatid, `
Invalid Amount
Please enter a valid number for the amount.
                Example: /addrecurringexpenses 100 rent monthly 6
                    `);
    }
    if (!validFrequencies.includes(frequency)) {
        return sendtext(chatid, `
Invalid Frequency
Please use: daily, weekly, or monthly.
                Example: /addrecurringexpenses 100 rent monthly 6
                    `);
    }
    if (isNaN(duration) || duration <= 0) {
        return sendtext(chatid, `
Invalid Duration
Please enter a valid number for duration.
                Example: /addrecurringexpenses 100 rent monthly 6
                    `);
    }

    let user = await User.findOne({ telegramid: userid });
    if (!user) {
        user = new User({
            telegramid: userid,
            name: msg.from.first_name,
            username: msg.from.username,
            recurringexpenses: []
        });
    }

    if (!user.recurringexpenses) {
        user.recurringexpenses = [];
    }

    user.recurringexpenses.push({
        amount,
        category,
        frequency,
        duration,
        date: new Date(),
        startdate: new Date(),
        enddate: new Date(new Date().setFullYear(new Date().getFullYear() + duration))
    });

    await user.save();
    console.log('Recurring expense saved successfully:', user);
    return sendtext(chatid, `
Recurring Expense Added!
                - Amount: ₹${amount}
            - Category: ${category}
            - Frequency: ${frequency}
            - Duration: ${duration} time(s)
Manage your recurring expenses with ease!
                `);
}

async function handleReminders(msg, text, userid, chatid) {
    const parts = text.trim().split(/\s+/);
    if (parts.length < 4) {
        return sendtext(chatid, `
Invalid Format
Please use: /setreminder <amount> <category> <duration> [daily|weekly|monthly]
            Example: /setreminder 100 groceries 3 weekly
                `);
    }

    const amount = parseFloat(parts[1]);
    const category = parts[2];
    const duration = parseInt(parts[3]);
    const frequency = (parts[4] || 'daily').toLowerCase();

    const validFrequencies = ['daily', 'weekly', 'monthly'];
    if (isNaN(amount) || amount <= 0 || isNaN(duration) || duration <= 0) {
        return sendtext(chatid, `
Invalid Input
Please provide a valid amount and duration.
                Example: /setreminder 100 groceries 3 weekly
                    `);
    }
    if (!validFrequencies.includes(frequency)) {
        return sendtext(chatid, `
Invalid Frequency
Please use: daily, weekly, or monthly.
                Example: /setreminder 100 groceries 3 weekly
                    `);
    }

    let user = await User.findOne({ telegramid: userid });
    if (!user) {
        user = new User({
            telegramid: userid,
            name: msg.from.first_name,
            username: msg.from.username,
            remainders: []
        });
    }

    if (!user.remainders) {
        user.remainders = [];
    }

    const now = new Date();
    for (let i = 0; i < duration; i++) {
        const reminderDate = new Date(now);
        if (frequency === 'monthly') {
            reminderDate.setMonth(reminderDate.getMonth() + i);
        } else if (frequency === 'weekly') {
            reminderDate.setDate(reminderDate.getDate() + i * 7);
        } else {
            reminderDate.setDate(reminderDate.getDate() + i);
        }

        user.remainders.push({
            amount,
            category,
            duration,
            date: reminderDate
        });
    }

    await user.save();
    return sendtext(chatid, `
Reminder Set!
                - Amount: ₹${amount}
            - Category: ${category}
            - Frequency: ${frequency}
            - Duration: ${duration} time(s)
Stay on top of your expenses with reminders!
                `);
}

async function handletodayexpenses(msg, text, userid, chatid) {
    try {
        let user = await User.findOne({ telegramid: userid });
        if (!user) {
            user = new User({
                telegramid: userid,
                name: msg.from.first_name,
                username: msg.from.username,
                expenses: []
            });
            await user.save();
            return sendtext(chatid, `
Today's Expenses
No expenses recorded for today from local host.
Start tracking with /addexpenses!
                `);
        }

        const today = new Date();
        const remaindersDueToday = user.remainders.filter(reminder => {
            const reminderDate = new Date(reminder.date);
            return reminderDate.getDate() === today.getDate() &&
                reminderDate.getMonth() === today.getMonth() &&
                reminderDate.getFullYear() === today.getFullYear();
        });
        const todayexpenses = user.expenses.filter(expense => {
            const expensedate = new Date(expense.date);
            return expensedate.getDate() === today.getDate() &&
                expensedate.getMonth() === today.getMonth() &&
                expensedate.getFullYear() === today.getFullYear();
        });

        if (todayexpenses.length === 0) {
            return sendtext(chatid, `
Today's Expenses
No expenses recorded for today from local host.
                ${remaindersDueToday.length > 0 ? `
Reminders Due Today
${remaindersDueToday.map(r => `- ₹${r.amount} - ${r.category}`).join('\n')}
` : ''
                } `);
        }

        const total = todayexpenses.reduce((sum, e) => sum + e.amount, 0);
        return sendtext(chatid, `
Today's Expenses
${todayexpenses.map(e => `- ₹${e.amount} - ${e.category}`).join('\n')}
            Total: ₹${total}
${remaindersDueToday.length > 0 ? `
Reminders Due Today
${remaindersDueToday.map(r => `- ₹${r.amount} - ${r.category}`).join('\n')}
` : ''
            } `);
    } catch (err) {
        console.error('Error retrieving today\'s expenses:', err);
        return sendtext(chatid, `
            Error
Could not retrieve today's expenses. Please try again later.
                `);
    }
}

async function handleweeklyexpenses(msg, text, userid, chatid) {
    let user = await User.findOne({ telegramid: userid });
    if (!user) {
        user = new User({
            telegramid: userid,
            name: msg.from.first_name,
            username: msg.from.username,
            expenses: []
        });
        await user.save();
        return sendtext(chatid, `
Weekly Expenses
No expenses recorded for the past week.
Start tracking with /addexpenses!
                `);
    }

    const today = new Date();
    const weekStartDate = new Date();
    weekStartDate.setDate(today.getDate() - 7);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const groupedExpenses = {};
    let total = 0;

    for (const expense of user.expenses) {
        const expDate = new Date(expense.date);
        if (expDate >= weekStartDate && expDate <= today) {
            const day = weekdays[expDate.getDay()];
            if (!groupedExpenses[day]) groupedExpenses[day] = [];
            groupedExpenses[day].push(expense);
            total += expense.amount;
        }
    }

    if (Object.keys(groupedExpenses).length === 0) {
        return sendtext(chatid, `
Weekly Expenses
No expenses recorded for the past week.
Start tracking with /addexpenses!
                `);
    }

    let message = `Weekly Expenses\n\n`;
    weekdays.forEach(day => {
        if (groupedExpenses[day]) {
            message += `${day} \n${groupedExpenses[day].map(exp => `- ₹${exp.amount} - ${exp.category}`).join('\n')} \n\n`;
        }
    });
    message += `Total: ₹${total} `;

    const remaindersDueToday = user.remainders.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        return reminderDate.getDate() === today.getDate() &&
            reminderDate.getMonth() === today.getMonth() &&
            reminderDate.getFullYear() === today.getFullYear();
    });

    return sendtext(chatid, message, remaindersDueToday.length > 0 ? `
Reminders Due Today
${remaindersDueToday.map(r => `- ₹${r.amount} - ${r.category}`).join('\n')}
            ` : '');
}

async function handlemonthlyexpenses(msg, text, userid, chatid) {
    let user = await User.findOne({ telegramid: userid });
    if (!user) {
        user = new User({
            telegramid: userid,
            name: msg.from.first_name,
            username: msg.from.username,
            expenses: []
        });
        await user.save();
        return sendtext(chatid, `
Monthly Expenses
No expenses recorded for this month.
Start tracking with /addexpenses!
                `);
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyExpenses = user.expenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    if (monthlyExpenses.length === 0) {
        return sendtext(chatid, `
Monthly Expenses
No expenses recorded for this month.
Start tracking with /addexpenses!
                `);
    }

    const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const message = `
Monthly Expenses
${monthlyExpenses.map(e => `- ₹${e.amount} - ${e.category}`).join('\n')}
            Total: ₹${total}
            `;
    return sendtext(chatid, message);
}

export async function sendtext(chatid, text, extra = '') {
    console.log(' [SENDING MESSAGE]', { chatid, text });
    try {
        const response = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            chat_id: chatid,
            text: text + (extra ? extra : ''),
            parse_mode: 'Markdown'
        });
        console.log(' [MESSAGE SENT]', {
            status: response.status,
            data: response.data
        });
        return response.data;
    } catch (err) {
        console.error(' [MESSAGE SEND ERROR]', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
        });
        throw err;
    }
}

export async function setWebhook() {
    const webhookUrl = `https://bb79-205-254-186-192.ngrok-free.app/bot`;
    console.log(' [SETTING WEBHOOK]', { webhookUrl });

    try {
        const response = await axios.get(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${webhookUrl}&drop_pending_updates=true`
        );

        console.log(' [WEBHOOK SET SUCCESS]', {
            status: response.status,
            data: response.data
        });

        // Verify webhook info
        const info = await axios.get(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getWebhookInfo`
        );
        console.log(' [WEBHOOK INFO]', info.data);

        return response.data;
    } catch (error) {
        console.error(' [WEBHOOK ERROR]', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
}