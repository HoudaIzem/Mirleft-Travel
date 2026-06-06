
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';

chromium.use(StealthPlugin());

console.log('🚀 FINAL VACATION RENTALS SCRAPER - MIRLEFT ONLY!');

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
    const VACATION_URL = 'https://www.booking.com/searchresults.html?ss=Mirleft%2C+Souss-Massa%2C+Morocco&hf_type=privacy_type%3Aentire_home_apt';
    console.log('🌐 Navigating to Booking.com Mirleft Vacation Rentals...');
    await page.goto(VACATION_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });

    console.log('⏳ Waiting 8 seconds...');
    await page.waitForTimeout(8000);

    console.log('📜 Scrolling down...');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(3000);

    console.log('📦 Extracting data...');
    const rentals = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="property-card"]'));
      return cards.map((card, index) => {
        const name = card.querySelector('[data-testid="title"]')?.textContent?.trim() || `Vacation Rental ${index + 1}`;
        const location = card.querySelector('[data-testid="address-link"]')?.textContent?.trim() || 'Mirleft, Morocco';
        const image = card.querySelector('[data-testid="image"]')?.src || '';
        const ratingText = card.querySelector('[data-testid="review-score"]')?.textContent?.trim() || '';

        let price = 'N/A';
        const priceEl = card.querySelector('[data-testid="price-and-discounted-price"]');
        if (priceEl) price = priceEl.textContent?.trim() || 'N/A';

        let rating = 4.5;
        const ratingMatch = ratingText.match(/(\d+[.,]\d)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1].replace(',', '.'));
        }

        return {
          name,
          price,
          rating,
          image,
          location,
          description: ratingText,
          type: 'vacation_rental',
        };
      }).filter(h => h.name.length > 2);
    });

    console.log(`✅ Found ${rentals.length} total vacation rentals!`);
    console.log('');

    // Filter for Mirleft only
    const mirleftOnly = rentals.filter(r =>
      r.location.toLowerCase().includes('mirleft')
    );
    console.log(`✅ Found ${mirleftOnly.length} Mirleft vacation rentals!`);
    console.log('');

    const LARAVEL_URL = 'http://127.0.0.1:8000/api/scrape/properties';

    console.log('💾 Sending data to Laravel API...');
    let savedCount = 0;
    for (const [index, rental] of mirleftOnly.entries()) {
      console.log(`[${index + 1}/${mirleftOnly.length}] Saving: ${rental.name}`);
      try {
        const response = await axios.post(LARAVEL_URL, {
          ...rental,
          views_count: Math.floor(Math.random() * 500) + 50,
          reviews_count: Math.floor(Math.random() * 200) + 10,
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
    console.log(`🎉 FINISHED! Saved ${savedCount} vacation rentals!`);

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
