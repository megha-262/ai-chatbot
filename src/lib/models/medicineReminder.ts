import mongoose from 'mongoose';

const MedicineReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicine: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  taken: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.MedicineReminder || mongoose.model('MedicineReminder', MedicineReminderSchema);