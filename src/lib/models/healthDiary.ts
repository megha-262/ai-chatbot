import mongoose from 'mongoose';

const HealthDiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  entry: {
    type: String,
    required: true,
  },
});

export default mongoose.models.HealthDiary || mongoose.model('HealthDiary', HealthDiarySchema);