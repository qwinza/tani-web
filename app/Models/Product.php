<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'description',
        'price',
        'unit',
        'stock',
        'min_order',
        'image_url',
        'images',
        'features',
        'origin',
        'certifications',
        'harvest_date',
    ];

    protected $casts = [
        'images' => 'array',
        'features' => 'array',
        'certifications' => 'array',
        'harvest_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
