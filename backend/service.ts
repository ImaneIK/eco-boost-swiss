// backend/service.ts
import { google } from 'googleapis';
import credentials from '../comparatifdevis-85da4843662d.json'; // adjust path if needed

type Mode = 'simulator' | 'devis_form';

const sheetsMap: Record<Mode, string> = {
  simulator: '183qvGhvNchAsMXAkmVRveOBuL32FcfQ51A1Ts321Lkw', // replace with your actual Sheet ID
  devis_form: '183qvGhvNchAsMXAkmVRveOBuL32FcfQ51A1Ts321Lkw',    // replace with your actual Sheet ID
};

interface Payload {
  mode: Mode;
  [key: string]: any; // any additional fields from forms
}

export class SheetsService {
  private sheets;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async appendRow(payload: Payload) {
    if (!payload.mode || !sheetsMap[payload.mode]) {
      throw new Error('Invalid mode');
    }

    const spreadsheetId = sheetsMap[payload.mode];

    // Map payload to row depending on the mode
    let row: any[] = [];
    if (payload.mode === 'simulator') {
      row = [
        payload.submittedAt,
        payload.fullname,
        payload.email,
        payload.phone,
        payload.project,
        payload.canton,
        payload.postal || 'N/A',
        payload.postalCity || 'N/A',
        payload.buildingType || 'N/A',
        payload.currentSystem || 'N/A',
        payload.power || 0,
        payload.pacType || 'N/A',
        payload.ownerStatus || 'N/A',
        payload.installationType || 'N/A',
        payload.serviceYear || 'N/A',
        payload.hasCECB || false,
        payload.autoconsommation || 0,
        payload.pvAid || 0,
        payload.hpAid || 0,
        payload.communal || 0,
        payload.total || 0,
        payload.notes || 'N/A',
      ];
    } else if (payload.mode === 'devis_form') {
      row = [
        payload.submittedAt,
        payload.name,
        payload.email,
        payload.phone,
        payload.projectType,
        payload.codepostal,
        payload.details,
      ];
    }

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1', // adjust if you want a specific tab
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    console.log(`Row appended for mode: ${payload.mode}`);
  }
}
