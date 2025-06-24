import { Op } from 'sequelize';
import { JournalEntryRepository } from '../repositories/JournalEntryRepository';
import { MoodExtractor } from './MoodExtractor';

export class ValidationError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'ValidationError';
  }
}
export class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotFoundError';
  }
}

export class JournalEntryService {
  constructor(
    entryRepo = new JournalEntryRepository(),
    moodExtractor = new MoodExtractor()
  ) {
    this.repo = entryRepo;
    this.moodExtractor = moodExtractor;
  }

  async getById(id) {
    const entry = await this.repo.findById(id);
    if (!entry) throw new NotFoundError('Entry not found');

    if (!entry.mood) {
      const mood = this.moodExtractor.extract(entry.text);
      await entry.update({ mood });
    }
    return entry;
  }

  async updateText(id, text) {
    if (!text || !text.trim()) throw new ValidationError('Text must not be empty');
    const updated = await this.repo.update(id, { text });
    if (!updated) throw new NotFoundError('Entry not found');
    return { id };
  }

  async delete(id) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundError('Entry not found');
  }

  async list({ moods, startDate, endDate } = {}) {
    const filter = {};
    if (moods) filter.mood = { [Op.in]: moods.split(',') };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt[Op.gte] = new Date(startDate);
      if (endDate)   filter.createdAt[Op.lte] = new Date(endDate);
    }
    return this.repo.findAll(filter);
  }

  async create(text) {
    if (!text || !text.trim()) {
        throw new ValidationError('Text must not be empty');
    }
    const mood = await this.moodExtractor.extract(text);
    const entry = await this.repo.create({ text, mood });
    return { id: entry.id };
  }

  async getSummary({ startDate, endDate } = {}) {
    const where = { mood: { [Op.ne]: null } };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = startDate;
      if (endDate)   where.createdAt[Op.lte] = endDate;
    }
    const rows = await this.repo.getMoodSummary(where);
    const summary = {};
    for (const row of rows) {
      summary[row.get('mood')] = parseInt(row.get('count'), 10);
    }
    return summary;
  }
}

export const journalEntryService = new JournalEntryService(
  new JournalEntryRepository(),
  new MoodExtractor()
);
