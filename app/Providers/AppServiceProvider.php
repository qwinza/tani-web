<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production, non-local, or when running on Cloud Run
        if ($this->app->environment('production') || config('app.env') !== 'local' || isset($_SERVER['K_SERVICE'])) {
            URL::forceScheme('https');
        }
    }
}
