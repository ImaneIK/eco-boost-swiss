const express = require('express');
const cors = require('cors');
import { SheetsService } from './service';

const app = express();
app.use(cors({ origin: '*' })); // frontend origin
app.use(express.json());

const sheetsService = new SheetsService();

app.post('/submit', async (req: any, res: any) => {
  try {
    await sheetsService.appendRow(req.body);
    res.status(200).json({ status: 'success' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(5678, () => {
  console.log('Backend running on https://eco-boost-swiss.vercel.app/');
});

