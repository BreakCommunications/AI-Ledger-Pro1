import { analyzeDocument } from './openai';

interface InvoiceData {
  type: 'income' | 'expense';
  amount: number;
  date: Date;
  category: string;
  description: string;
}

export const categorizeInvoice = async (content: string): Promise<InvoiceData> => {
  const prompt = `Analyze the following invoice content and extract the following information:
1. Type (income or expense)
2. Amount
3. Date
4. Category (e.g., Office Supplies, Utilities, Services, etc.)
5. Brief description

Invoice content:
${content}

Please provide the extracted information in JSON format.`;

  const analysis = await analyzeDocument(prompt);
  
  try {
    const invoiceData: InvoiceData = JSON.parse(analysis);
    return {
      ...invoiceData,
      date: new Date(invoiceData.date),
      amount: parseFloat(invoiceData.amount.toString())
    };
  } catch (error) {
    console.error('Error parsing invoice data:', error);
    throw new Error('Failed to categorize invoice');
  }
};