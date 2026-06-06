
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';

chromium.use(StealthPlugin());

console.log('🚀 FINAL RESTAURANTS SCRAPER - MIRLEFT ONLY!');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 150,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  try {
    const RESTAURANTS_URL = 'https://www.tripadvisor.com/Restaurants-g1895204-Mirleft_Souss_Massa.html';
    console.log('🌐 Navigating to TripAdvisor Mirleft Restaurants...');
    await page.goto(RESTAURANTS_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });

    console.log('⏳ Waiting 8 seconds...');
    await page.waitForTimeout(8000);

    console.log('📜 Scrolling down...');
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(3000);

    console.log('📦 Extracting data...');
    const restaurants = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="card"], div[class*="listing"]'));
      return cards.map((card, index) => {
        const name = card.querySelector('h1, h2, h3, a[href*="Restaurant_Review"]')?.textContent?.trim() || `Restaurant ${index + 1}`;
        const ratingText = card.querySelector('span[class*="rating"], span[aria-label*="rating"]')?.textContent?.trim() || '';
        const image = card.querySelector('img')?.src || '';
        const location = 'Mirleft, Morocco';

        let rating = 4.5;
        const ratingMatch = ratingText.match(/(\d+[.,]\d)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1].replace(',', '.'));
        }

        // Determine cuisine type
        let cuisine = 'Moroccan';
        const text = card.innerText.toLowerCase();
        if (text.includes('seafood')) cuisine = 'Seafood';
        else if (text.includes('pizza') || text.includes('italian')) cuisine = 'Italian';
        else if (text.includes('french')) cuisine = 'French';

        return {
          name,
          cuisine,
          rating,
          image,
          location,
          description: `مطعم رائع في Mirleft`,
          price_range: '$$',
        };
      }).filter(h => h.name.length > 2);
    });

    console.log(`✅ Found ${restaurants.length} total restaurants!`);
    console.log('');

    const LARAVEL_URL = 'http://127.0.0.1:8000/api/scrape/restaurants';

    console.log('💾 Sending data to Laravel API...');
    let savedCount = 0;
    for (const [index, restaurant] of restaurants.entries()) {
      console.log(`[${index + 1}/${restaurants.length}] Saving: ${restaurant.name}`);
      try {
        const response = await axios.post(LARAVEL_URL, {
          ...restaurant,
          views_count: Math.floor(Math.random() * 200) + 20,
          reviews_count: Math.floor(Math.random() * 100) + 5,
        });

        if (response.status === 201) {
          console.log('   ✅ Saved successfully!');
          savedCount++;
        }
      } catch (error) {
        console.error('   ❌ Error saving:', error.response?.data || error.message);
      }
      await new Promise(r => setTimeout(r, 300));
    }

    console.log('');
    console.log(`🎉 FINISHED! Saved ${savedCount} restaurants!`);

  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    console.log('');
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
    console.log('🛑 Browser closed!');
  }
})();
