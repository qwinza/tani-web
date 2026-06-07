<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Rate limiter for login endpoint (max 5 attempts per minute per IP)
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'message' => 'Terlalu banyak percobaan masuk. Silakan coba lagi dalam 1 menit.'
                ], 429, $headers);
            });
        });

        // Rate limiter for register endpoint (max 5 attempts per minute per IP)
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'message' => 'Terlalu banyak percobaan pendaftaran dari IP Anda. Silakan coba lagi dalam 1 menit.'
                ], 429, $headers);
            });
        });
    }
}
