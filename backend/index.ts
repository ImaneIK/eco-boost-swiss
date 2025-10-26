import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import dotenv from 'dotenv';
import { google, sheets_v4 } from 'googleapis';
import { SheetsService, SimulatorPayload, DevisFormPayload, Payload } from './service';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Initialize logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Define response interface
interface SubmitResponseBody {
  status: 'success' | 'error';
  message?: string;
}

type SubmitRequestBody = SimulatorPayload | DevisFormPayload;

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ['POST'],
  })
);
app.use(express.json());

// Initialize Google Sheets API client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.SPREADSHEET_ID || '';
const sheetsService = new SheetsService(sheets, spreadsheetId, logger);

// Validation middleware
const validateSubmitBody = (
  req: Request<Record<string, never>, SubmitResponseBody, SubmitRequestBody>,
  res: Response<SubmitResponseBody>,
  next: NextFunction
) => {
  const { mode, submittedAt, email } = req.body;
  if (!mode || !submittedAt || !email) {
    logger.warn('Invalid request body', { body: req.body });
    return res.status(400).json({ status: 'error', message: 'Mode, submittedAt, and email are required' });
  }
  if (mode === 'simulator') {
    const { fullname, phone, project, canton } = req.body as SimulatorPayload;
    if (!fullname || !phone || !project || !canton) {
      logger.warn('Invalid simulator payload', { body: req.body });
      return res.status(400).json({ status: 'error', message: 'Required simulator fields missing' });
    }
  } else if (mode === 'devis_form') {
    const { name, phone, projectType, codepostal, details } = req.body as DevisFormPayload;
    if (!name || !phone || !projectType || !codepostal || !details) {
      logger.warn('Invalid devis_form payload', { body: req.body });
      return res.status(400).json({ status: 'error', message: 'Required devis_form fields missing' });
    }
  } else {
    logger.warn('Invalid mode', { mode });
    return res.status(400).json({ status: 'error', message: 'Invalid mode' });
  }
  next();
};

// Routes
app.post(
  '/submit',
  validateSubmitBody,
  async (
    req: Request<Record<string, never>, SubmitResponseBody, SubmitRequestBody>,
    res: Response<SubmitResponseBody>
  ) => {
    try {
      await sheetsService.appendRow(req.body);
      logger.info('Row appended successfully', { mode: req.body.mode });
      res.status(200).json({ status: 'success' });
    } catch (err: unknown) {
      logger.error('Error appending row', { error: err });
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
);

// Global error handler
app.use((err: unknown, req: Request, res: Response<SubmitResponseBody>, next: NextFunction) => {
  logger.error('Unhandled error', { error: err });
  const errorMessage = process.env.NODE_ENV === 'production' ? 'Internal server error' : (err instanceof Error ? err.message : 'Unknown error');
  res.status(500).json({ status: 'error', message: errorMessage });
});

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5678;
  app.listen(port, () => {
    logger.info(`Backend running on http://localhost:${port}`);
  });
}

// Export for GCP Cloud Functions
export const api = app;