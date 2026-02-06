import mongoose from 'mongoose';

const InterestSchema = new mongoose.Schema({
    email: { type: String, required: true },
    consent: { type: Boolean, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Interest', InterestSchema);