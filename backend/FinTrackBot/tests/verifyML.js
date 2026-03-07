import { investmentML } from '../ml/models/investmentRecommender.js';

async function verifyModel() {
    console.log("--- Verifying InvestmentRecommender ML Model ---");

    // Train the model
    investmentML.train();

    const testCases = [
        { income: 50000, spend: 30000, desc: "Middle class, 40% surplus" },
        { income: 100000, spend: 30000, desc: "High income, 70% surplus" },
        { income: 30000, spend: 13567, desc: "User's Scenario: Low income, 55% surplus" },
        { income: 30000, spend: 28000, desc: "Low income, low surplus" },
        { income: 150000, spend: 120000, desc: "High income, high spend, 20% surplus" }

    ];

    testCases.forEach(tc => {
        const recommendation = investmentML.recommend(tc.income, tc.spend);
        const surplus = tc.income - tc.spend;
        const percentage = surplus > 0 ? (recommendation / surplus * 100).toFixed(1) : 0;

        console.log(`\nScenario: ${tc.desc}`);
        console.log(`Income: ${tc.income}, Spend: ${tc.spend}, Surplus: ${surplus}`);
        console.log(`Recommendation: ₹${recommendation} (${percentage}% of surplus)`);
    });

    console.log("\n--- Verification Complete ---");
}

verifyModel().catch(console.error);
