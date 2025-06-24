import { withHandler } from '../../../lib/withHandler';
import { journalEntryService as service } from '../../../services/JournalEntryService';

async function listHandler(req, res) {
  const entries = await service.list(req.query);
  res.status(200).json(entries);
}

async function postHandler(req, res) {
  const newEntry = await service.create(req.body.text);
  res.status(201).json(newEntry);
}

export default withHandler(async (req, res) => {
  switch (req.method) {
    case 'GET': return listHandler(req, res);
    case 'POST': return postHandler(req, res);
  }
}, ['GET','POST']);