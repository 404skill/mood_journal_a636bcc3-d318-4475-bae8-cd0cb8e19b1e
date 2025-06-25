import { withHandler } from "../../../lib/withHandler";
import { journalEntryService as service } from "../../../services/JournalEntryService";
import { ValidationError } from "../../../services/JournalEntryService";

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUUID(id) {
  if (!id || !UUID_REGEX.test(id)) {
    throw new ValidationError("Invalid UUID format");
  }
}

async function getIdHandler(req, res) {
  const { id } = req.query;
  validateUUID(id);
  const entry = await service.getById(id);
  res.status(200).json(entry);
}

async function putHandler(req, res) {
  const { id } = req.query;
  validateUUID(id);
  const { id: updatedId } = await service.updateText(id, req.body.text);
  res.status(200).json({ id: updatedId });
}

async function deleteHandler(req, res) {
  const { id } = req.query;
  validateUUID(id);
  await service.delete(id);
  res.status(204).end();
}

export default withHandler(
  async (req, res) => {
    switch (req.method) {
      case "GET":
        return getIdHandler(req, res);
      case "PUT":
        return putHandler(req, res);
      case "DELETE":
        return deleteHandler(req, res);
    }
  },
  ["GET", "PUT", "DELETE"]
);
