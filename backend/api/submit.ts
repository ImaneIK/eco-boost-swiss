import { VercelRequest, VercelResponse } from '@vercel/node';
import { google, sheets_v4 } from 'googleapis';
import { Logger, transports } from 'winston';
import cors from 'cors';
import { SheetsService, Payload } from '../service';

// Initialize logger
const logger = new Logger({
  transports: [new transports.Console()],
});

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

// Initialize SheetsService
const sheetsService = new SheetsService(sheets, process.env.SPREADSHEET_ID || '', logger);

// CORS middleware
const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
});

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  return corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      logger.warn('Method not allowed', { method: req.method });
      return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    try {
      const payload: Payload = req.body;
      await sheetsService.appendRow(payload);
      res.json({ status: 'success' });
    } catch (err: any) {
      logger.error('Error appending row', { error: err.message });
      res.status(500).json({ status: 'error', message: 'Failed to append row' });
    }
  });
}