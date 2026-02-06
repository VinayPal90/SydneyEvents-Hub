import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeSydneyEvents = async () => {
    try {
        const url = 'https://www.eventbrite.com.au/d/australia--sydney/all-events/'; 
        const { data } = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const scrapedEvents = [];
        const baseUrl = 'https://www.eventbrite.com.au';

        $('.discover-search-desktop-card, .event-card, article').each((index, element) => {
            const title = $(element).find('h2, h3, .event-card__title').first().text().trim();
            const dateText = $(element).find('.event-card__date, time, p').first().text().trim();
            
            let originalURL = $(element).find('a').attr('href') || "";
            if (originalURL && !originalURL.startsWith('http')) {
                originalURL = baseUrl + originalURL;
            }

            // --- ADVANCED IMAGE EXTRACTION ---
            let img = $(element).find('img');
            let imageURL = img.attr('src') || img.attr('data-src') || img.attr('srcset')?.split(' ')[0];

            // Filter out base64/placeholders
            if (imageURL && (imageURL.includes('data:image') || imageURL.includes('placeholder'))) {
                imageURL = img.attr('data-src') || img.attr('content');
            }
            // --- END ---

            const description = $(element).find('p, .event-card__description').text().trim().substring(0, 150);

            if (title && originalURL) {
                scrapedEvents.push({
                    title,
                    dateTime: new Date(dateText).toString() !== 'Invalid Date' ? new Date(dateText) : new Date(),
                    venue: { name: 'Sydney, Australia' },
                    description: description || "Join us for this exciting event in Sydney!",
                    imageURL: imageURL || 'https://via.placeholder.com/600x400?text=Sydney+Event',
                    originalURL,
                    sourceWebsite: 'Eventbrite',
                    status: 'new'
                });
            }
        });

        console.log(`Extracted ${scrapedEvents.length} events.`);
        return scrapedEvents;
    } catch (error) {
        console.error("Scraper Error:", error.message);
        return [];
    }
};