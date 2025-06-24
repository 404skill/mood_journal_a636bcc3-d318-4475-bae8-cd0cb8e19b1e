import { journalEntryService } from '../../../services/JournalEntryService';
import { withHandler } from '../../../lib/withHandler';
import { ValidationError } from '../../../services/JournalEntryService';

async function summaryHandler(req, res) {
  const { startDate, endDate } = req.query;
  let start, end;

  if (startDate) {
    start = new Date(startDate);
    if (isNaN(start)) {
      return res.status(400).json({ error: 'Invalid startDate format' });
    }
  }
  if (endDate) {
    end = new Date(endDate);
    if (isNaN(end)) {
      return res.status(400).json({ error: 'Invalid endDate format' });
    }
  }

  try {
    const summary = await journalEntryService.getSummary({ startDate: start, endDate: end });
    return res.status(200).json(summary);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withHandler(summaryHandler, ['GET']);
