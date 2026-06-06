<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::get('/home', [HomeController::class, 'index']);
Route::get('/search', [HomeController::class, 'search']);
Route::post('/chat', [ChatController::class, 'chat'])->middleware('throttle:15,1');

Route::post('/scrape/properties', function (Illuminate\Http\Request $request) {
    $mirleftId = App\Models\Destination::where('slug', 'mirleft')->first()?->id ?? 1;

    $data = $request->validate([
        'name' => 'required|string',
        'price' => 'nullable',
        'rating' => 'nullable',
        'image' => 'nullable',
        'location' => 'nullable|string',
        'description' => 'nullable|string',
        'type' => 'nullable|string',
        'views_count' => 'nullable|integer',
        'reviews_count' => 'nullable|integer',
    ]);

    $price = is_numeric($data['price']) ? floatval($data['price']) : 350;
    if ($price < 50) $price = rand(200, 800);

    $rating = is_numeric($data['rating']) ? floatval($data['rating']) : 4.5;
    if ($rating < 1 || $rating > 10) $rating = 4.5;

    $image = $data['image'] ?? 'https://images.unsplash.com/photo-1560185007-6e8f83735b90?w=800';
    $image = preg_replace('/^[`\s]+|[`\s]+$/', '', $image);

    $property = App\Models\Property::updateOrCreate(
        ['name' => $data['name'], 'destination_id' => $mirleftId],
        [
            'price' => round($price),
            'rating' => $rating,
            'average_rating' => $rating,
            'image' => $image,
            'description' => $data['description'] ?? 'فندق رائع في Mirleft مع إطلالات جميلة على البحر.',
            'location' => $data['location'] ?? 'Mirleft, Morocco',
            'type' => $data['type'] ?? 'hotel',
            'status' => 'active',
            'destination_id' => $mirleftId,
            'views_count' => $data['views_count'] ?? rand(50, 500),
            'reviews_count' => $data['reviews_count'] ?? rand(10, 200),
            'latitude' => 30.6700 + (rand(0, 100) / 10000),
            'longitude' => -9.6350 + (rand(0, 100) / 10000),
        ]
    );

    return response()->json([
        'message' => 'Property saved!',
        'data' => $property
    ], 201);
});

// Endpoint for Restaurants
Route::post('/scrape/restaurants', function (Illuminate\Http\Request $request) {
    $mirleftId = App\Models\Destination::where('slug', 'mirleft')->first()?->id ?? 1;

    $data = $request->validate([
        'name' => 'required|string',
        'cuisine' => 'nullable|string',
        'rating' => 'nullable',
        'image' => 'nullable',
        'location' => 'nullable|string',
        'description' => 'nullable|string',
        'price_range' => 'nullable|string',
        'views_count' => 'nullable|integer',
        'reviews_count' => 'nullable|integer',
    ]);

    $rating = is_numeric($data['rating']) ? floatval($data['rating']) : 4.5;
    if ($rating < 1 || $rating > 10) $rating = 4.5;

    $image = $data['image'] ?? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
    $image = preg_replace('/^[`\s]+|[`\s]+$/', '', $image);

    $restaurant = App\Models\Restaurant::updateOrCreate(
        ['name' => $data['name']],
        [
            'name' => $data['name'],
            'cuisine' => $data['cuisine'] ?? 'Moroccan',
            'location' => $data['location'] ?? 'Mirleft, Morocco',
            'image' => $image,
            'description' => $data['description'] ?? 'مطعم رائع في Mirleft',
            'price_range' => $data['price_range'] ?? '$$',
            'average_rating' => $rating,
            'reviews_count' => $data['reviews_count'] ?? rand(10, 200),
            'status' => 'active',
            'destination_id' => $mirleftId,
            'views_count' => $data['views_count'] ?? rand(20, 200),
        ]
    );

    return response()->json(['message' => 'Restaurant saved!', 'data' => $restaurant], 201);
});

// Endpoint for Activities (Things to Do)
Route::post('/scrape/activities', function (Illuminate\Http\Request $request) {
    $mirleftId = App\Models\Destination::where('slug', 'mirleft')->first()?->id ?? 1;

    $data = $request->validate([
        'title' => 'required|string',
        'category' => 'nullable|string',
        'price' => 'nullable',
        'rating' => 'nullable',
        'image' => 'nullable',
        'location' => 'nullable|string',
        'description' => 'nullable|string',
        'duration' => 'nullable|string',
        'views_count' => 'nullable|integer',
        'reviews_count' => 'nullable|integer',
    ]);

    $rating = is_numeric($data['rating']) ? floatval($data['rating']) : 4.5;
    if ($rating < 1 || $rating > 10) $rating = 4.5;

    $price = is_numeric($data['price']) ? floatval($data['price']) : 200;
    if ($price < 50) $price = rand(100, 500);

    $image = $data['image'] ?? 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800';
    $image = preg_replace('/^[`\s]+|[`\s]+$/', '', $image);

    $activity = App\Models\Activity::updateOrCreate(
        ['title' => $data['title'], 'destination_id' => $mirleftId],
        [
            'title' => $data['title'],
            'category' => $data['category'] ?? 'Outdoor',
            'price' => round($price),
            'rating' => $rating,
            'average_rating' => $rating,
            'image' => $image,
            'description' => $data['description'] ?? 'نشاط رائع في Mirleft',
            'location' => $data['location'] ?? 'Mirleft, Morocco',
            'duration' => $data['duration'] ?? '2 hours',
            'status' => 'active',
            'destination_id' => $mirleftId,
            'views_count' => $data['views_count'] ?? rand(20, 200),
            'reviews_count' => $data['reviews_count'] ?? rand(10, 200),
        ]
    );

    return response()->json(['message' => 'Activity saved!', 'data' => $activity], 201);
});

// Properties
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/search', [PropertyController::class, 'search']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/vacation-rentals', [PropertyController::class, 'vacationRentals']);

// Restaurants
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/search', [RestaurantController::class, 'search']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// Activities
Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/activities/search', [ActivityController::class, 'search']);
Route::get('/activities/{id}', [ActivityController::class, 'show']);

// Destinations
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{slug}', [DestinationController::class, 'show']);

// Reviews (read-only public)
Route::get('/reviews', [ReviewController::class, 'index']);

// Newsletter subscription
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

// Contact form
Route::post('/contact', [ContactController::class, 'store']);

// Amenities
Route::get('/amenities', [AmenityController::class, 'index']);

// FAQs
Route::get('/faqs', [FaqController::class, 'index']);

// Protected routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'updateProfile']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);
    Route::post('/favorites/check', [FavoriteController::class, 'isFavorite']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->middleware('throttle:10,1');
    Route::patch('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Photos
    Route::post('/photos', [PhotoController::class, 'store']);
    Route::delete('/photos/{id}', [PhotoController::class, 'destroy']);
    Route::patch('/photos/{id}', [PhotoController::class, 'update']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        // Properties
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::patch('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

        // Restaurants
        Route::post('/restaurants', [RestaurantController::class, 'store']);
        Route::patch('/restaurants/{id}', [RestaurantController::class, 'update']);
        Route::delete('/restaurants/{id}', [RestaurantController::class, 'destroy']);

        // Activities
        Route::post('/activities', [ActivityController::class, 'store']);
        Route::patch('/activities/{id}', [ActivityController::class, 'update']);
        Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);

        // Destinations
        Route::post('/destinations', [DestinationController::class, 'store']);
        Route::patch('/destinations/{id}', [DestinationController::class, 'update']);
        Route::delete('/destinations/{id}', [DestinationController::class, 'destroy']);

        // Amenities
        Route::post('/amenities', [AmenityController::class, 'store']);
        Route::patch('/amenities/{id}', [AmenityController::class, 'update']);
        Route::delete('/amenities/{id}', [AmenityController::class, 'destroy']);

        // Contacts
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/contacts/{id}', [ContactController::class, 'show']);
        Route::post('/contacts/{id}/reply', [ContactController::class, 'reply']);

        // Newsletter
        Route::get('/newsletters', [NewsletterController::class, 'index']);

        // Admin users/reviews/dashboard
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/statistics', [AdminController::class, 'statistics']);

        Route::post('/faqs', [FaqController::class, 'store']);
        Route::patch('/faqs/{faq}', [FaqController::class, 'update']);
        Route::delete('/faqs/{faq}', [FaqController::class, 'destroy']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::patch('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::patch('/admin/users/{id}/ban', [AdminController::class, 'banUser']);
        Route::patch('/admin/users/{id}/unban', [AdminController::class, 'unbanUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/reviews', [AdminController::class, 'reviews']);
        Route::patch('/admin/reviews/{id}/moderate', [AdminController::class, 'moderateReview']);
    });
});
