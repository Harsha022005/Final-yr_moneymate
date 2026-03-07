import express from 'express';
import connectDB from './models/db.js';
import dotenv from 'dotenv';
dotenv.config();
import { handletelegramupdates } from './Routes/Telegramhandler.js';
import { setWebhook } from './Routes/Telegramhandler.js';
import fetchbotid from './Routes/botid.js';
import cors from 'cors';
import { startOverspendingCron } from "./cron/overspending.cron.js";
import { detectOverspending } from './services/overspending.service.js';
import predictionRoutes from './Routes/prediction.routes.js';
import { getInvestmentRecommendation } from './services/investment.service.js';
import authRoutes from './Routes/auth.routes.js';
import statsRoutes from './Routes/stats.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';

setWebhook();




const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  console.log('Request received', req.body);
  res.send('Get request received');
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://fintrackbotwebsite-7iqj.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.post('/bot', async (req, res) => {
  const msg = req.body.message;
  console.log('Request received', req.body);
  if (msg) {
    await handletelegramupdates(msg);
  }
  res.sendStatus(200);
});

// Auth routes
app.use('/api/auth', authRoutes);

// Dashboard data route (protected)
app.use('/userdash/getexpenses', authenticateToken, fetchbotid);

// Prediction routes (protected)
app.use('/api/predict', authenticateToken, predictionRoutes);

// Stats routes (protected)
app.use('/api/stats', authenticateToken, statsRoutes);

app.get('/api/overspending/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Security check: ensure user is accessing their own data
    if (req.user.telegramid !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized access to another user's data" });
    }

    const overspendingData = await detectOverspending(parseInt(userId));

    if (!overspendingData) {
      return res.status(404).json({
        error: 'No overspending data found',
        metrics: {
          available: false
        }
      });
    }

    // Add model metrics to the response
    const response = {
      ...overspendingData,
      metrics: {
        ...overspendingData.metrics,
        model: overspendingData.usingBudgetRule ? 'budget_rule' : 'statistical_model',
        timestamp: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error in overspending endpoint:', error);
    res.status(500).json({
      error: 'Failed to analyze spending',
      metrics: {
        error: error.message
      }
    });
  }
});
// investment recommendation endpoint
app.get('/api/investments/recommend/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Security check: ensure user is accessing their own data
    if (req.user.telegramid !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized access to another user's data" });
    }

    const recommendation = await getInvestmentRecommendation(parseInt(userId));

    if (!recommendation) {
      return res.status(404).json({
        error: 'Could not generate investment recommendation',
        metrics: {
          available: false
        }
      });
    }

    // Add metadata to the response
    const response = {
      ...recommendation,
      metadata: {
        timestamp: new Date().toISOString(),
        modelVersion: '1.0.0-ml'
      }
    };


    res.json(response);
  } catch (error) {
    console.error('Error in investment recommendations endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate investment recommendations',
      metrics: {
        error: error.message
      }
    });
  }
});
startOverspendingCron();

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
