<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\OrderController;


Route::get('/', [LandingPageController::class, 'index']);
Route::get('/api/features', [LandingPageController::class, 'getFeatures']);
Route::get('/api/farmers', [AuthController::class, 'getPublicFarmers']);

// Auth Routes
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/logout', [AuthController::class, 'logout'])->middleware('auth');
Route::get('/api/user', [AuthController::class, 'user'])->middleware('auth');
Route::put('/api/user', [AuthController::class, 'updateProfile'])->middleware('auth');

// Product Routes
Route::middleware(['auth'])->group(function () {
    // Buyer routes
    Route::get('/api/products', [ProductController::class, 'index'])->middleware('role:pembeli');
    
    // Farmer routes
    Route::middleware(['role:petani'])->group(function () {
        Route::get('/api/my-products', [ProductController::class, 'myProducts']);
        Route::post('/api/products', [ProductController::class, 'store']);
        Route::put('/api/products/{product}', [ProductController::class, 'update']);
        Route::delete('/api/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/api/categories', [AdminController::class, 'categories']);
        
        // Farmer Order views
        Route::get('/api/farmer/orders', [OrderController::class, 'farmerOrders']);
        Route::patch('/api/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

    // Buyer & All Auth User routes
    Route::middleware(['auth'])->group(function() {
        Route::get('/api/orders', [OrderController::class, 'index']);
        Route::post('/api/orders', [OrderController::class, 'store']);
        Route::get('/api/categories', [AdminController::class, 'categories']);
        Route::get('/api/announcements/latest', [AdminController::class, 'announcements']); // Simple fetch
    });

    // Admin routes
    Route::middleware(['role:superadmin'])->group(function () {
        Route::get('/api/admin/stats', [AdminController::class, 'getStats']);
        Route::get('/api/admin/users', [AuthController::class, 'allUsers']); // Need to add this to AuthController
        Route::patch('/api/admin/users/{user}/toggle', [AdminController::class, 'toggleUserStatus']);
        Route::patch('/api/admin/users/{user}/verify', [AdminController::class, 'verifyFarmer']);
        
        Route::get('/api/admin/categories', [AdminController::class, 'categories']);
        Route::post('/api/admin/categories', [AdminController::class, 'storeCategory']);
        Route::delete('/api/admin/categories/{category}', [AdminController::class, 'deleteCategory']);

        Route::get('/api/admin/orders', [AdminController::class, 'orders']);
        
        Route::get('/api/admin/announcements', [AdminController::class, 'announcements']);
        Route::post('/api/admin/announcements', [AdminController::class, 'postAnnouncement']);
    });
});

// Fallback for SPA
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
