import mongoose from "mongoose";

const UserLoginDataExternal = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    EmailAddress: { type: String, maxlength: 100 },
    ExternalProviderId: { type: Number, required: true},
    ExternalProviderToken: { type: String, maxlenght: 100},
});

export default mongoose.models.UserLoginDataExternal || mongoose.model('UserLoginDataExternal', UserLoginDataExternal);
