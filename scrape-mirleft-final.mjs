import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';

chromium.use(StealthPlugin());

async function main() {
    console.log('Begin scraping Mirleft...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100,
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
    });

    const page = await context.newPage();

    try {
        console.log('Navigating to Booking.com...');
        await page.goto(
            'https://www.booking.com/searchresults.html?ss=Mirleft%2C Morocco&dest_id=-1346847&dest_type=city',
            { waitUntil: 'domcontentloaded', timeout: 60000 }
        );

        console.log('Waiting for results...');
        await page.waitForTimeout(5000);

        console.log('Extracting hotels...');
        const hotels = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('[data-testid="property-card"]'));
            return cards.map(card => {
                const name = card.querySelector('[data-testid="title"]')?.textContent?.trim() || '';
                let price = 'N/A';

                const priceEl = card.querySelector('[data-testid="price-and-discounted-price"]') ||
                    card.querySelector('.a53cb12da4') ||
                    card.querySelector('.e6e58518a0');

                if (priceEl) {
                    price = priceEl.textContent?.trim() || 'N/A';
                    const priceMatch = price.match(/\d+/);
                    if (priceMatch) {
                        price = parseInt(priceMatch[0]);
                    }
                }

                const image = card.querySelector('img[data-testid="image"]')?.src ||
                    card.querySelector('img')?.src ||
                    'https://images.unsplash.com/photo-1560185007-6e8f83735b90?w=800';

                let location = 'Mirleft, Morocco';
                const locationEl = card.querySelector('[data-testid="address-link"]') ||
                    card.querySelector('.f3c4b70bc1');

                if (locationEl) {
                    location = locationEl.textContent?.trim() || location;
                }

                let rating = 0;
                const ratingEl = card.querySelector('[data-testid="review-score"]') ||
                    card.querySelector('.a3b8729ab1');

                if (ratingEl) {
                    const ratingText = ratingEl.textContent?.trim() || '';
                    const ratingMatch = ratingText.match(/(\d+[.,]\d+)/);
                    if (ratingMatch) {
                        rating = parseFloat(ratingMatch[1].replace(',', '.'));
                    }
                }

                let description = 'Hotel in Mirleft';
                const descEl = card.querySelector('[data-testid="card-reviews-count"]') ||
                    card.querySelector('.abf093bdfe');

                if (descEl) {
                    description = descEl.textContent?.trim() || description;
                }

                return {
                    name,
                    price: typeof price === 'string' ? 350 : price,
                    rating: rating || 4.5,
                    image,
                    location,
                    description,
                    type: 'hotel',
                    views_count: Math.floor(Math.random() * 400) + 100,
                    reviews_count: Math.floor(Math.random() * 200) + 20,
                };
            }).filter(h => h.name.length > 2);
        });

        console.log(`Fetched ${hotels.length} hotels!`);

        hotels.forEach((hotel, i) => {
            console.log(`\n${i + 1}. ${hotel.name}`);
            console.log(`   ${hotel.location}`);
            console.log(`   ${hotel.rating}`);
            console.log(`   ${hotel.price} MAD`);
        });

        if (hotels.length > 0) {
            console.log('\nSaving to Laravel...');
            const LARAVEL_URL = 'http://127.0.0.1:8000/api/scrape/properties';

            let savedCount = 0;

            for (const hotel of hotels) {
                try {
                    const response = await axios.post(LARAVEL_URL, hotel);

                    if (response.status === 201) {
                        console.log(`Saved: ${hotel.name}`);
                        savedCount++;
                    }
                } catch (error) {
                    if (error.response) {
                        console.log(`Error in ${hotel.name}:`, error.response.data);
                    } else if (error.request) {
                        console.log('Cannot connect to Laravel server');
                        break;
                    }
                }
            }

            console.log(`Saved ${savedCount} hotels`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        console.log('Closing browser...');
        await browser.close();
    }
}

main();