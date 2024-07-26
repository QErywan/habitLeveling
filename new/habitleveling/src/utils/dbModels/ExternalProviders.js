import mongoose from "mongoose";

const ExternalProviderSchema = new mongoose.Schema({
    ExternalProviderId: { type: Number, required: true, unique: true },
    ExternalProviderName: { type: String, maxlength: 50 },
});

export default mongoose.models.ExternalProvider || mongoose.model('ExternalProviders', ExternalProviderSchema);