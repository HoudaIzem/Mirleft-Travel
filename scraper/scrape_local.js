/**
 * scrape_local.js — offline Mirleft hotel import for Laravel mirleft:scrape
 * Reads debug_booking.html when present, otherwise writes sample hotels.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'debug_booking.html');
const outputPath = path.join(__dirname, 'hotels.json');

const sampleHotels = [
    {
        name: 'Riad Mirleft Ocean',
        price: '450',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        location: 'Mirleft, Morocco',
        description: 'Charming riad with Atlantic views and rooftop terrace.',
        type: 'riad',
        status: 'active',
        rating: 4.6,
        reviews_count: 42,
    },
    {
        name: 'Villa Aftas Surf Lodge',
        price: '680',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        location: 'Aftas Beach, Mirleft',
        description: 'Surf-friendly villa steps from Aftas beach breaks.',
        type: 'villa',
        status: 'active',
        rating: 4.8,
        reviews_count: 31,
    },
    {
        name: 'Hotel Legzira View',
        price: '520',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        location: 'Mirleft, Morocco',
        description: 'Comfortable hotel ideal for trips to Legzira arches.',
        type: 'hotel',
        status: 'active',
        rating: 4.4,
        reviews_count: 58,
    },
];

function parseHtml(html) {
    const hotels = [];
    const cardRegex = /<div[^>]*data-testid="property-card"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
    let match;

    while ((match = cardRegex.exec(html)) !== null) {
        const block = match[1];
        const name = block.match(/data-testid="title"[^>]*>([^<]+)</i)?.[1]?.trim();
        const price = block.match(/data-testid="price-and-discounted-price"[^>]*>[\s\S]*?([\d,]+)/i)?.[1]?.replace(/,/g, '');
        if (name) {
            hotels.push({
                name,
                price: price || '300',
                location: 'Mirleft, Morocco',
                description: `Accommodation in Mirleft — ${name}.`,
                type: 'hotel',
                status: 'active',
                rating: 4.2,
                reviews_count: 10,
            });
        }
    }

    return hotels;
}

function main() {
    let hotels = sampleHotels;

    if (fs.existsSync(htmlPath)) {
        console.log('Parsing debug_booking.html...');
        const html = fs.readFileSync(htmlPath, 'utf8');
        const parsed = parseHtml(html);
        if (parsed.length > 0) {
            hotels = parsed;
            console.log(`Parsed ${parsed.length} hotels from HTML.`);
        } else {
            console.log('No cards parsed from HTML; using sample data.');
        }
    } else {
        console.log('debug_booking.html not found; writing sample hotels.json.');
    }

    fs.writeFileSync(outputPath, JSON.stringify(hotels, null, 2), 'utf8');
    console.log(`Wrote ${hotels.length} hotels to ${outputPath}`);
}

main();
