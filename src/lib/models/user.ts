import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  healthDiary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthDiary',
    },
  ],
  medicineReminders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicineReminder',
    },
  ],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);