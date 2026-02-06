import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dateTime: { type: Date, required: true },
    venue: {
        name: String,
        address: String
    },
    city: { type: String, default: 'Sydney' },
    description: String,
    category: [String],
    imageURL: String,
    sourceWebsite: String,
    originalURL: { type: String, unique: true },
    status: { 
        type: String, 
        enum: ['new', 'updated', 'inactive', 'imported'],
        default: 'new' 
    },
    lastScrapedAt: { type: Date, default: Date.now },
    importedAt: Date,
    importedBy: String,
    importNotes: String
});

export default mongoose.model('Event', EventSchema);