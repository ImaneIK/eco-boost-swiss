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
let sheets: sheets_v4.Sheets | undefined = undefined;  // Initialize to undefined
try {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheets = google.sheets({ version: 'v4', auth });
  logger.info('Google Sheets auth initialized successfully');
} catch (err) {
  logger.error('Failed to initialize Google Sheets auth', { error: err });
}

// Initialize SheetsService
let sheetsService: SheetsService | undefined = undefined;  // Initialize to undefined
if (sheets) {
  try {
    sheetsService = new SheetsService(sheets, process.env.SPREADSHEET_ID || '', logger);
    logger.info('SheetsService initialized successfully');
  } catch (err) {
    logger.error('Failed to initialize SheetsService', { error: err });
  }
}

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
});

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  return corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      logger.warn('Method not allowed', { method: req.method });
      return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    // Check if SheetsService is ready
    if (!sheetsService) {
      logger.error('SheetsService not initialized - check env vars');
      return res.status(500).json({ status: 'error', message: 'Service not ready' });
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