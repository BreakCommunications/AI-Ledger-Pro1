import axios from 'axios';
import cheerio from 'cheerio';
import { redis } from '../config/redis';
import logger from '../utils/logger';

interface TaxRates {
  incomeTax: {
    brackets: { min: number; max: number; rate: number }[];
  };
  vatRates: {
    standard: number;
    reduced: number;
  };
}

const BELASTINGDIENST_URL = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/home/home';

export const scrapeTaxRates = async (): Promise<TaxRates> => {
  try {
    const cachedRates = await redis.get('taxRates');
    if (cachedRates) {
      logger.info('Tax rates fetched from cache');
      return JSON.parse(cachedRates);
    }

    const response = await axios.get(BELASTINGDIENST_URL);
    const $ = cheerio.load(response.data);

    // Note: The following selectors are placeholders. You'll need to inspect the actual Belastingdienst website
    // and adjust these selectors accordingly.
    const incomeTaxBrackets = $('.income-tax-table tr').map((i, el) => {
      const cells = $(el).find('td');
      return {
        min: parseFloat($(cells[0]).text().replace(/[^0-9.-]+/g,"")),
        max: parseFloat($(cells[1]).text().replace(/[^0-9.-]+/g,"")) || Infinity,
        rate: parseFloat($(cells[2]).text().replace(/[^0-9.-]+/g,""))
      };
    }).get();

    const vatRates = {
      standard: parseFloat($('.vat-rates .standard-rate').text().replace(/[^0-9.-]+/g,"")),
      reduced: parseFloat($('.vat-rates .reduced-rate').text().replace(/[^0-9.-]+/g,""))
    };

    const rates: TaxRates = {
      incomeTax: {
        brackets: incomeTaxBrackets
      },
      vatRates
    };

    await redis.set('taxRates', JSON.stringify(rates), 'EX', 24 * 60 * 60); // Cache for 24 hours

    logger.info('Tax rates scraped and cached');
    return rates;
  } catch (error) {
    logger.error('Error scraping tax rates:', error);
    throw new Error('Failed to scrape tax rates');
  }
};

export const monitorTaxRates = async (callback: (rates: TaxRates) => void) => {
  const checkForUpdates = async () => {
    try {
      const rates = await scrapeTaxRates();
      const oldRates = JSON.parse(await redis.get('oldTaxRates') || '{}');

      if (JSON.stringify(rates) !== JSON.stringify(oldRates)) {
        logger.info('Tax rates have changed');
        await redis.set('oldTaxRates', JSON.stringify(rates));
        callback(rates);
      } else {
        logger.info('No changes in tax rates');
      }
    } catch (error) {
      logger.error('Error monitoring tax rates:', error);
    }
  };

  // Check for updates every day
  setInterval(checkForUpdates, 24 * 60 * 60 * 1000);

  // Initial check
  await checkForUpdates();
};