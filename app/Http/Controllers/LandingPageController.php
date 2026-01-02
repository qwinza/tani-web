<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    /**
     * Display the landing page.
     */
    public function index()
    {
        $features = Feature::all();
        
        // Since the user is using a manual routing in app.jsx, 
        // we can still return a view or use Inertia if they prefer.
        // For now, I'll provide an API-like response method too.
        return view('welcome', compact('features'));
    }

    /**
     * Get features as JSON.
     */
    public function getFeatures()
    {
        return response()->json(Feature::all());
    }
}
