import { VercelRequest, VercelResponse } from '@vercel/node';
import { google, sheets_v4 } from 'googleapis';
import winston from 'winston';  // Import the default winston
import cors from 'cors';
import { SheetsService, Payload } from '../service';

// Create logger using factory method (more robust)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

// Test logger immediately (logs to console in Vercel for debugging)
logger.info('Logger initialized successfully');

// Initialize Google Sheets API
let sheets: sheets_v4.Sheets | undefined = undefined;
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
let sheetsService: SheetsService | undefined = undefined;
if (sheets) {
  try {
    sheetsService = new SheetsService(sheets, process.env.SPREADSHEET_ID || '', logger);
    logger.info('SheetsService initialized successfully');
  } catch (err) {
    logger.error('Failed to initialize SheetsService', { error: err });
  }
} else {
  logger.error('Cannot initialize SheetsService - sheets is undefined');
}

// CORS options
const corsOptions = {
  origin: '*',
  methods: 'GET, POST, OPTIONS',
  allowedHeaders: 'Content-Type',
  credentials: false,
};

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Explicitly handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods);
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders);
    res.setHeader('Access-Control-Max-Age', '86400');
    logger.info('OPTIONS preflight handled');
    return res.status(200).end();
  }

  // Apply CORS to response
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods);
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders);

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
    logger.info('Received payload', { payload: req.body });
    const payload: Payload = req.body;
    await sheetsService.appendRow(payload);
    logger.info('Row appended successfully', { mode: payload.mode });
    res.json({ status: 'success' });
  } catch (err: any) {
    logger.error('Error appending row', { error: err.message, stack: err.stack });
    res.status(500).json({ status: 'error', message: 'Failed to append row' });
  }
}