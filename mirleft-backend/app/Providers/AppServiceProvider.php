<?php

namespace App\Providers;

use App\Models\Activity;
use App\Models\Booking;
use App\Models\Faq;
use App\Models\Favorite;
use App\Models\Photo;
use App\Models\Property;
use App\Models\Restaurant;
use App\Models\Review;
use App\Policies\ActivityPolicy;
use App\Policies\BookingPolicy;
use App\Policies\FaqPolicy;
use App\Policies\FavoritePolicy;
use App\Policies\PhotoPolicy;
use App\Policies\PropertyPolicy;
use App\Policies\RestaurantPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Property::class, PropertyPolicy::class);
        Gate::policy(Restaurant::class, RestaurantPolicy::class);
        Gate::policy(Activity::class, ActivityPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
        Gate::policy(Booking::class, BookingPolicy::class);
        Gate::policy(Photo::class, PhotoPolicy::class);
        Gate::policy(Faq::class, FaqPolicy::class);
        Gate::policy(Favorite::class, FavoritePolicy::class);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });
    }
}
