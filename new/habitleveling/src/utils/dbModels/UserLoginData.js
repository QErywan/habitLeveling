import mongoose from "mongoose";

const UserLoginDataSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    PasswordHash: { type: String, required: true, maxlength: 250 },
    PasswordSalt: { type: String, maxlength: 100 },
    EmailAddress: { type: String, maxlength: 100 },
    // ConfirmationToken: { type: String, maxlength: 100 },
    // TokenGenerationTime: { type: Date },
    // EmailValidationStatus: { type: Boolean },
    // PasswordResetToken: { type: String, maxlength: 100 },
    // RecoveryTokenTime: { type: Date },
});

export default mongoose.models.UserLoginData || mongoose.model('UserLoginData', UserLoginDataSchema);
