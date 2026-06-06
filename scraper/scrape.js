// =============================================================
// Mirleft Scraper – Hotels | Restaurants | Things to do | Rentals
// =============================================================
import 'dotenv/config';
import axios from 'axios';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

// --- CONFIG ----------------------------------------------------------
const API_BASE = process.env.API_BASE || 'http://127.0.0.1:8000/api';
const API_EMAIL = process.env.API_EMAIL || 'admin@mirleft.com';
const API_PASSWORD = process.env.API_PASSWORD || 'admin123';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const PER_CATEGORY = 28;
const MAX_PAGES = 4;
const NAV_TIMEOUT = 60000;

const CATEGORIES = {
  hotels: {
    type: 'hotel',
    url: 'https://www.booking.com/searchresults.html?ss=Mirleft&order=class',
  },
  restaurants: {
    type: 'restaurant',
    url: 'https://www.booking.com/restaurants/searchresults.html?ss=Mirleft&order=class',
  },
  attractions: {
    type: 'attraction',
    url: 'https://www.booking.com/attractions/searchresults.html?ss=Mirleft&order=class',
  },
  rentals: {
    type: 'rental',
    url: 'https://www.booking.com/holiday-rentals/searchresults.html?ss=Mirleft&order=class',
  },
};

// --- HELPERS ---------------------------------------------------------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function login() {
  const { data } = await axios.post(`${API_BASE}/login`, {
    email: API_EMAIL, password: API_PASSWORD,
  });
  if (!data?.token) throw new Error('No token received from /login');
  console.log('✅ Logged in to Laravel backend');
  return data.token;
}

async function withRetry(fn, attempts = 3, delayMs = 1500) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      console.warn(`   ↻ attempt ${i}/${attempts} failed: ${e.message}`);
      await sleep(delayMs * i);
    }
  }
  throw lastErr;
}

async function postItem(token, item) {
  return withRetry(() =>
    axios.post(`${API_BASE}/properties`, item, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    })
  );
}

function parsePrice(text) {
  if (!text) return null;
  const m = text.replace(/\s/g, '').match(/(\d+[.,]?\d*)/);
  return m ? m[1].replace(',', '') : null;
}

function parseRating(text) {
  if (!text) return null;
  const m = text.match(/(\d+[.,]\d+)/);
  return m ? m[1].replace(',', '.') : null;
}

// --- MAIN ------------------------------------------------------------
(async () => {
  const token = await login().catch((e) => {
    console.error('❌ Login failed –', e.message);
    process.exit(1);
  });

  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({
    userAgent: UA,
    locale: 'en-GB',
    viewport: { width: 1366, height: 900 },
  });
  const page = await ctx.newPage();

  // ---------- Scrape one category ----------
  async function scrapeCategory(key, cfg) {
    console.log(`\n========= 📂 ${key.toUpperCase()} =========`);
    const items = [];
    try {
      await page.goto(cfg.url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      // Cookie banner
      try {
        await page.locator('#onetrust-accept-btn-handler, button[aria-label="Accept all"]')
          .first().click({ timeout: 3000 });
      } catch { }

      for (let p = 1; p <= MAX_PAGES && items.length < PER_CATEGORY; p++) {
        console.log(`  📄 page ${p}`);
        // Generic card selector (works for hotels + restaurants + attractions + rentals)
        const cardSel = '[data-testid="property-card"], [data-testid="restaurant-card"], [data-testid="attraction-card"], [data-testid="holiday-rental-card"]';
        try {
          await page.waitForSelector(cardSel, { timeout: 15000 });
        } catch {
          console.log('  ⚠️ no cards found');
          break;
        }
        await sleep(1500);

        const batch = await page.evaluate((cardSel) => {
          const cards = document.querySelectorAll(cardSel);
          const out = [];
          cards.forEach(card => {
            const name =
              card.querySelector('[data-testid="title"]')?.textContent.trim() ||
              card.querySelector('h3')?.textContent.trim() ||
              card.querySelector('.fc63351294')?.textContent.trim() || '';
            if (name.length < 2) return;

            const priceEl =
              card.querySelector('[data-testid="price-and-discounted-price"]') ||
              card.querySelector('[data-testid="recommended-price"]') ||
              card.querySelector('.fbd1d3018a, .prco-valign-middle');
            const imgEl = card.querySelector('img');
            const addrEl = card.querySelector('[data-testid="address-link"], [data-testid="location"]');
            const scoreEl = card.querySelector('[data-testid="review-score"], [data-testid="rating"]');

            out.push({
              name: name,
              price: priceEl?.textContent?.trim() ?? null,
              image: imgEl?.src || imgEl?.getAttribute('data-src') || '',
              location: addrEl?.textContent?.trim() || 'Mirleft, Morocco',
              description: scoreEl?.textContent?.trim() || '',
            });
          });
          return out;
        }, cardSel);

        // Clean items
        batch.forEach(b => {
          b.price = parsePrice(b.price);
          const r = parseRating(b.description);
          if (r) b.description = `Rating: ${r}/10`;
          else if (!b.description) b.description = `${cfg.type} in Mirleft.`;
          b.type = cfg.type;
          b.status = 'active';
        });

        console.log(`     → ${batch.length} parsed`);
        items.push(...batch);

        // next page
        const next = await page.$('button[aria-label="Next page"], a[rel="next"]');
        if (!next) { console.log('  🚫 end of results'); break; }
        try {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
            next.click(),
          ]);
        } catch {
          console.log('  🚫 navigation failed');
          break;
        }
      }
    } catch (e) {
      console.error(`  ❌ ${key} scrape error:`, e.message);
    }
    return items.slice(0, PER_CATEGORY);
  }

  // ---------- Send to Laravel ----------
  async function sendCategory(key, items) {
    console.log(`\n📤 Sending ${items.length} ${key} …`);
    let saved = 0, failed = 0;
    for (const it of items) {
      try {
        await postItem(token, it);
        console.log(`   ✅ ${it.name}`);
        saved++;
      } catch (e) {
        console.error(`   ❌ ${it.name} – ${e.response?.data?.message || e.message}`);
        failed++;
      }
      await sleep(400);
    }
    return { saved, failed };
  }

  // ---------- Loop all categories ----------
  const summary = {};
  for (const [key, cfg] of Object.entries(CATEGORIES)) {
    const items = await scrapeCategory(key, cfg);
    console.log(`\n📊 ${key}: collected ${items.length} items`);
    summary[key] = await sendCategory(key, items);
  }

  // ---------- Report ----------
  console.log('\n=========== 🎉 SUMMARY ===========');
  for (const [k, v] of Object.entries(summary)) {
    console.log(`  ${k}: ✅ ${v.saved}  ❌ ${v.failed}`);
  }

  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error('💥 Fatal error:', e);
  process.exit(1);
});
