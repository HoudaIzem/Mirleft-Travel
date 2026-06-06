
# Mirleft Scraper

نظام سكرابينغ لجلب بيانات Mirleft من مواقع الإنترنت وتخزينها في Laravel.

## الخطوات

### 1. تثبيت الاعتماديات

```bash
cd scraper
npm install
```

### 2. تشغيل خادم Laravel

في نافذة CMD جديدة:
```bash
cd mirleft-backend
php artisan serve
```

### 3. تشغيل السكرابينغات

توجد سكربتات جاهزة لكل نوع من البيانات:

| النوع | الملف | URL الهدف |
|-------|--------|-----------|
| فنادق | `final-scraper.mjs` | Booking.com |
| مطاعم | `final-restaurants.mjs` | TripAdvisor |
| نشاطات/أشياء للعمل | `final-activities.mjs` | TripAdvisor |
| إيجارات عطلات | `final-vacation-rentals.mjs` | Booking.com |

تشغيل أي سكربت:
```bash
node final-scraper.mjs
node final-restaurants.mjs
node final-activities.mjs
node final-vacation-rentals.mjs
```

## ملفات التصحيح (Debug)

توجد ملفات تصحيح لتجربة الصفحات قبل السكرابينغ النهائي:
- `debug-script.mjs` (للفنادق)
- `debug-restaurants.mjs`
- `debug-activities.mjs`

## ملاحظات

- جميع السكربتات تفتح متصفح حقيقي (لا Headless) لتجنب كشف الـ Bot
- جميع البيانات تخزن في Mirleft Destination فقط
- يتم استخدام `updateOrCreate` لتجنب تكرار البيانات
