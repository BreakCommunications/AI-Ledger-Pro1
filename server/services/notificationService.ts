import User from '../models/User';
import { sendEmail } from '../utils/emailService';
import logger from '../utils/logger';

export const notifyUsersOfTaxRateChange = async (newRates: any) => {
  try {
    const users = await User.find({ notifications: { $in: ['tax_updates'] } });

    for (const user of users) {
      await sendEmail(
        user.email,
        'Tax Rates Update',
        `Dear ${user.companyName},\n\nThe tax rates have been updated. Please log in to your account to view the new rates.\n\nBest regards,\nAI DocChat Team`
      );
    }

    logger.info(`Notified ${users.length} users about tax rate changes`);
  } catch (error) {
    logger.error('Error notifying users of tax rate change:', error);
  }
};