import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Status : { type: Boolean, default: false },
  });

const UserDataSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    Username: { type: String, required: true, unique: true },
    JobTitle: { type: String, required: true },
    Level: { type: Number, default: 1 },
    Experience: { type: Number, default: 0 },
    Stats: { type: Array, default: [ { STR: 0, AGI: 0, VIT: 0, INT: 0, FAI: 0, LUK: 0 } ] },
    HabitList: [HabitSchema],
});

export default mongoose.models.UserData || mongoose.model('UserData', UserDataSchema);