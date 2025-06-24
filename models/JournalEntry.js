import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/db';

class JournalEntry extends Model {}
JournalEntry.init({
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  text: { type: DataTypes.TEXT, allowNull: false },
  mood: { type: DataTypes.STRING },
}, {
  sequelize,
  tableName: 'entries',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default JournalEntry;