import Event from '../models/Event.js';
import { scrapeSydneyEvents } from './scraper.js';

export const syncEventsToDB = async () => {
    console.log("🔄 Starting Sync logic...");
    const freshEvents = await scrapeSydneyEvents();
    
    if (freshEvents.length === 0) {
        console.log("⚠️ No events found to sync.");
        return;
    }

    const scrapedURLs = freshEvents.map(e => e.originalURL);

    // 1. Mark Inactive
    await Event.updateMany(
        { originalURL: { $nin: scrapedURLs }, status: { $ne: 'imported' } },
        { status: 'inactive' }
    );

    for (const eventData of freshEvents) {
        const existingEvent = await Event.findOne({ originalURL: eventData.originalURL });

        if (!existingEvent) {
            await Event.create(eventData);
        } else {
            // Check for updates
            if (existingEvent.title !== eventData.title) {
                await Event.updateOne(
                    { originalURL: eventData.originalURL },
                    { ...eventData, status: 'updated', lastScrapedAt: new Date() }
                );
            }
        }
    }
    console.log(`✅ Sync Completed! Processed ${freshEvents.length} events.`);
};