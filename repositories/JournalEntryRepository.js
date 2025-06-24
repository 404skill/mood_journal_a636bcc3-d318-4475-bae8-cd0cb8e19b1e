import JournalEntry from '../models/JournalEntry';
import { Op } from 'sequelize';

export class JournalEntryRepository {
  async findById(id) {
    return JournalEntry.findByPk(id);
  }

  async findAll(filter = {}, order = [['createdAt', 'DESC']]) {
    return JournalEntry.findAll({ where: filter, order });
  }

  async create(data) {
    return JournalEntry.create(data);
  }

  async update(id, changes) {
    const entry = await this.findById(id);
    if (!entry) return null;
    return entry.update(changes);
  }

  async delete(id) {
    const entry = await this.findById(id);
    if (!entry) return false;
    await entry.destroy();
    return true;
  }

  async getMoodSummary(where = {}) {
    return JournalEntry.findAll({
      attributes: [
        'mood',
        [JournalEntry.sequelize.fn('COUNT', JournalEntry.sequelize.col('mood')), 'count']
      ],
      group: ['mood'],
      where: {
        ...where,
        mood: { [Op.ne]: null }
      }
    });
  }
}