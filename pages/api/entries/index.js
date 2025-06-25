import { withHandler } from "../../../lib/withHandler";
import { journalEntryService as service } from "../../../services/JournalEntryService";
import { ValidationError } from "../../../services/JournalEntryService";

async function listHandler(req, res) {
  const { startDate, endDate, moods } = req.query;

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start)) {
      throw new ValidationError("Invalid date format");
    }
  }
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end)) {
      throw new ValidationError("Invalid date format");
    }
  }

  const entries = await service.list(req.query);
  res.status(200).json(entries);
}

async function postHandler(req, res) {
  const newEntry = await service.create(req.body.text);
  res.status(201).json(newEntry);
}

export default withHandler(
  async (req, res) => {
    switch (req.method) {
      case "GET":
        return listHandler(req, res);
      case "POST":
        return postHandler(req, res);
    }
  },
  ["GET", "POST"]
);
