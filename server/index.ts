import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import documentRoutes from './routes/documents';
import accountingRoutes from './routes/accounting';
import aiAssistantRoutes from './routes/aiAssistant';
import taxInfoRoutes from './routes/taxInfo';
import { monitorTaxRates } from './services/taxScraper';
import { notifyUsersOfTaxRateChange } from './services/notificationService';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/tax-info', taxInfoRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).send('Something went wrong!');
});

// Start tax rate monitoring
monitorTaxRates((newRates) => {
  logger.info('Tax rates updated:', newRates);
  notifyUsersOfTaxRateChange(newRates);
});

// Only listen if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

export default app;