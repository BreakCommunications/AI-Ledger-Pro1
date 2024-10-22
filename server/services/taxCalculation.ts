import { TaxRates } from './taxScraper';

export const calculateIncomeTax = (income: number, rates: TaxRates['incomeTax']): number => {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of rates.brackets) {
    if (remainingIncome <= 0) break;

    const taxableAmount = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableAmount * (bracket.rate / 100);
    remainingIncome -= taxableAmount;
  }

  return tax;
};

export const calculateVAT = (amount: number, rate: number): number => {
  return amount * (rate / 100);
};