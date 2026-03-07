import express from 'express';
import { predictNextMonth } from '../services/futurePrediction.service.js';
import { User } from '../models/schema.js';

const router = express.Router();

/**
 * @route   GET /api/predict/expense/:userId
 * @desc    Get predicted expense for the next month
 * @access  Public
 */
router.get('/expense/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ telegramid: parseInt(userId) });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const prediction = predictNextMonth(user.expenses || []);

        const response = {
            success: true,
            data: {
                predictedAmount: prediction.prediction,
                confidence: Math.round(prediction.confidence * 100),
                currency: '₹',
                message: prediction.prediction > 0
                    ? (prediction.confidence > 0.7 ? 'High confidence prediction based on your spending patterns.' : 'Prediction generated based on available data.')
                    : 'Not enough data to generate a reliable prediction.',
                modelMetrics: prediction.modelMetrics // This adds the F1-score, Precision, Recall, R2
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate prediction',
            error: error.message
        });
    }
});

export default router;
