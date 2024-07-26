import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
    // MongoDB will automatically create an _id field for each user
    FirstName: { type: String, maxLength: 100 },
    LastName: { type: String, maxLength: 100 },
});

export default mongoose.models.UserAccount || mongoose.model('UserAccount', UserAccountSchema);