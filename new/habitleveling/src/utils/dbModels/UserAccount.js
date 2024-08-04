import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
    // MongoDB will automatically create an _id field for each user
    FirstName: { type: String, maxLength: 100 },
    LastName: { type: String, maxLength: 100 },
    customerId: { type: String, maxLength: 100, default: '' },
    hasAccess: { type: Boolean, default: false },
    freeTrial: { type: Boolean, default: true },
    freeTrialEnd: { type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 },
});

export default mongoose.models.UserAccount || mongoose.model('UserAccount', UserAccountSchema);