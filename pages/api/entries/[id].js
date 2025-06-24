import { withHandler } from '../../../lib/withHandler';
import { journalEntryService as service } from '../../../services/JournalEntryService';

async function getIdHandler(req, res) {
  const { id } = req.query;
  const entry = await service.getById(id);
  res.status(200).json(entry);
}

async function putHandler(req, res) {
  const { id } = req.query;
  const { id: updatedId } = await service.updateText(id, req.body.text);
  res.status(200).json({ id: updatedId });
}

async function deleteHandler(req, res) {
  const { id } = req.query;
  await service.delete(id);
  res.status(204).end();
}

export default withHandler(async (req, res) => {
  switch (req.method) {
    case 'GET': return getIdHandler(req, res);
    case 'PUT': return putHandler(req, res);
    case 'DELETE': return deleteHandler(req, res);
  }
}, ['GET','PUT','DELETE']);