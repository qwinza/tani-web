<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of products for buyers.
     */
    public function index()
    {
        $products = Product::with(['user:id,name', 'category:id,name'])->get();

        // Ensure JSON fields are properly decoded as arrays
        $products->each(function ($product) {
            $product->features = is_string($product->features) ? json_decode($product->features, true) : $product->features;
            $product->images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
            $product->certifications = is_string($product->certifications) ? json_decode($product->certifications, true) : $product->certifications;
        });

        return response()->json($products);
    }

    /**
     * Display a single product by ID.
     */
    public function show($id)
    {
        $product = Product::with(['user:id,name,email', 'category:id,name'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Ensure JSON fields are properly decoded as arrays
        $product->features = is_string($product->features) ? json_decode($product->features, true) : $product->features;
        $product->images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
        $product->certifications = is_string($product->certifications) ? json_decode($product->certifications, true) : $product->certifications;

        return response()->json($product);
    }

    /**
     * Display products for the authenticated farmer.
     */
    public function myProducts()
    {
        return response()->json(Product::where('user_id', Auth::id())->get());
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'stock' => 'required|integer|min:0',
            'min_order' => 'nullable|integer|min:1',
            'origin' => 'nullable|string|max:255',
            'harvest_date' => 'nullable|date',
            'features' => 'nullable|json',
            'certifications' => 'nullable|json',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'additionalImages.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
            if (!in_array($file->getClientMimeType(), $allowedMimes)) {
                try {
                    \App\Models\SecurityAlert::create([
                        'event_type' => 'file_upload_blocked',
                        'ip_address' => $request->ip() ?? '127.0.0.1',
                        'user_agent' => $request->userAgent() ?? 'Unknown',
                        'details' => 'Unggahan berkas diblokir (store). Tipe berkas tidak sah: ' . $file->getClientMimeType() . ' (nama asli: ' . $file->getClientOriginalName() . ')',
                        'severity' => 'high',
                        'user_id' => Auth::id(),
                    ]);
                } catch (\Exception $e) {
                    logger()->error('Failed to log blocked file upload: ' . $e->getMessage());
                }
                return response()->json(['message' => 'Tipe berkas unggahan tidak diizinkan.'], 422);
            }

            $extension = $file->getClientOriginalExtension();
            if (empty($extension)) {
                $extension = 'jpg';
            }
            $fileName = \Illuminate\Support\Str::uuid() . '.' . $extension;
            $path = $file->storeAs('products', $fileName, 'public');
            $imageUrl = asset('storage/' . $path);
        }

        // Handle additional images
        $additionalImageUrls = [];
        if ($request->hasFile('additionalImages')) {
            foreach ($request->file('additionalImages') as $image) {
                if ($image) {
                    $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
                    if (!in_array($image->getClientMimeType(), $allowedMimes)) {
                        try {
                            \App\Models\SecurityAlert::create([
                                'event_type' => 'file_upload_blocked',
                                'ip_address' => $request->ip() ?? '127.0.0.1',
                                'user_agent' => $request->userAgent() ?? 'Unknown',
                                'details' => 'Unggahan berkas tambahan diblokir. Tipe berkas tidak sah: ' . $image->getClientMimeType() . ' (nama asli: ' . $image->getClientOriginalName() . ')',
                                'severity' => 'high',
                                'user_id' => Auth::id(),
                            ]);
                        } catch (\Exception $e) {}
                        return response()->json(['message' => 'Tipe berkas unggahan tambahan tidak diizinkan.'], 422);
                    }
                    $extension = $image->getClientOriginalExtension() ?: 'jpg';
                    $fileName = \Illuminate\Support\Str::uuid() . '.' . $extension;
                    $path = $image->storeAs('products', $fileName, 'public');
                    $additionalImageUrls[] = asset('storage/' . $path);
                }
            }
        }

        $product = Product::create([
            'user_id' => Auth::id(),
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'unit' => $request->unit ?? 'kg',
            'stock' => $request->stock,
            'min_order' => $request->min_order ?? 1,
            'origin' => $request->origin,
            'harvest_date' => $request->harvest_date,
            'features' => $request->features ? json_decode($request->features, true) : null,
            'certifications' => $request->certifications ? json_decode($request->certifications, true) : null,
            'image_url' => $imageUrl,
            'images' => !empty($additionalImageUrls) ? $additionalImageUrls : null,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'stock' => 'required|integer|min:0',
            'min_order' => 'nullable|integer|min:1',
            'origin' => 'nullable|string|max:255',
            'harvest_date' => 'nullable|date',
            'features' => 'nullable',
            'certifications' => 'nullable',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'additionalImages.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'unit' => $request->unit ?? 'kg',
            'stock' => $request->stock,
            'min_order' => $request->min_order ?? 1,
            'origin' => $request->origin,
            'harvest_date' => $request->harvest_date,
            'features' => $request->features,
            'certifications' => $request->certifications,
        ];

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
            if (!in_array($file->getClientMimeType(), $allowedMimes)) {
                try {
                    \App\Models\SecurityAlert::create([
                        'event_type' => 'file_upload_blocked',
                        'ip_address' => $request->ip() ?? '127.0.0.1',
                        'user_agent' => $request->userAgent() ?? 'Unknown',
                        'details' => 'Unggahan berkas diblokir (update). Tipe berkas tidak sah: ' . $file->getClientMimeType() . ' (nama asli: ' . $file->getClientOriginalName() . ')',
                        'severity' => 'high',
                        'user_id' => Auth::id(),
                    ]);
                } catch (\Exception $e) {
                    logger()->error('Failed to log blocked file upload: ' . $e->getMessage());
                }
                return response()->json(['message' => 'Tipe berkas unggahan tidak diizinkan.'], 422);
            }

            $extension = $file->getClientOriginalExtension();
            if (empty($extension)) {
                $extension = 'jpg';
            }
            $fileName = \Illuminate\Support\Str::uuid() . '.' . $extension;
            $path = $file->storeAs('products', $fileName, 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        // Handle additional images
        if ($request->hasFile('additionalImages')) {
            $additionalImageUrls = [];
            foreach ($request->file('additionalImages') as $image) {
                if ($image) {
                    $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
                    if (!in_array($image->getClientMimeType(), $allowedMimes)) {
                        try {
                            \App\Models\SecurityAlert::create([
                                'event_type' => 'file_upload_blocked',
                                'ip_address' => $request->ip() ?? '127.0.0.1',
                                'user_agent' => $request->userAgent() ?? 'Unknown',
                                'details' => 'Unggahan berkas tambahan diblokir (update). Tipe berkas tidak sah: ' . $image->getClientMimeType() . ' (nama asli: ' . $image->getClientOriginalName() . ')',
                                'severity' => 'high',
                                'user_id' => Auth::id(),
                            ]);
                        } catch (\Exception $e) {}
                        return response()->json(['message' => 'Tipe berkas unggahan tambahan tidak diizinkan.'], 422);
                    }
                    $extension = $image->getClientOriginalExtension() ?: 'jpg';
                    $fileName = \Illuminate\Support\Str::uuid() . '.' . $extension;
                    $path = $image->storeAs('products', $fileName, 'public');
                    $additionalImageUrls[] = asset('storage/' . $path);
                }
            }
            if (!empty($additionalImageUrls)) {
                $data['images'] = $additionalImageUrls;
            }
        }

        $product->update($data);

        return response()->json($product);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        if ($product->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
