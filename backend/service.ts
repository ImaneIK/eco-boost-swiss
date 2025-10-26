import { google, sheets_v4 } from 'googleapis';

export type Mode = 'simulator' | 'devis_form';

export interface SimulatorPayload {
  mode: 'simulator';
  submittedAt: string;
  fullname: string;
  email: string;
  phone: string;
  project: string;
  canton: string;
  postal?: string;
  postalCity?: string;
  buildingType?: string;
  currentSystem?: string;
  power?: number;
  pacType?: string;
  ownerStatus?: string;
  installationType?: string;
  serviceYear?: string;
  hasCECB?: boolean;
  autoconsommation?: number;
  pvAid?: number;
  hpAid?: number;
  communal?: number;
  total?: number;
  notes?: string;
}

export interface DevisFormPayload {
  mode: 'devis_form';
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  codepostal: string;
  details: string;
}

export type Payload = SimulatorPayload | DevisFormPayload;

export class SheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;
  private logger: import('winston').Logger;

  constructor(sheets: sheets_v4.Sheets, spreadsheetId: string, logger: import('winston').Logger) {
    this.sheets = sheets;
    this.spreadsheetId = spreadsheetId;
    this.logger = logger;
  }

  async appendRow(payload: Payload) {
    if (!payload.mode || !this.spreadsheetId) {
      throw new Error('Invalid mode or spreadsheet ID');
    }

    // Map mode to specific sheet tab
    const rangeMap: Record<Mode, string> = {
      simulator: 'Simulator!A1',
      devis_form: 'DevisForm!A1',
    };

    const range = rangeMap[payload.mode];
    if (!range) {
      throw new Error(`No range defined for mode: ${payload.mode}`);
    }

    let row: any[] = [];
    if (payload.mode === 'simulator') {
      const {
        submittedAt,
        fullname,
        email,
        phone,
        project,
        canton,
        postal = 'N/A',
        postalCity = 'N/A',
        buildingType = 'N/A',
        currentSystem = 'N/A',
        power = 0,
        pacType = 'N/A',
        ownerStatus = 'N/A',
        installationType = 'N/A',
        serviceYear = 'N/A',
        hasCECB = false,
        autoconsommation = 0,
        pvAid = 0,
        hpAid = 0,
        communal = 0,
        total = 0,
        notes = 'N/A',
      } = payload as SimulatorPayload;
      row = [
        submittedAt,
        fullname,
        email,
        phone,
        project,
        canton,
        postal,
        postalCity,
        buildingType,
        currentSystem,
        power,
        pacType,
        ownerStatus,
        installationType,
        serviceYear,
        hasCECB,
        autoconsommation,
        pvAid,
        hpAid,
        communal,
        total,
        notes,
      ];
    } else if (payload.mode === 'devis_form') {
      const { submittedAt, name, email, phone, projectType, codepostal, details } = payload as DevisFormPayload;
      row = [submittedAt, name, email, phone, projectType, codepostal, details];
    }

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    this.logger.info(`Row appended to ${range} for mode: ${payload.mode}`);
  }
}