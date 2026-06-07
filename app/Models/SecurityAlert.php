<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityAlert extends Model
{
    protected $fillable = [
        'event_type',
        'ip_address',
        'user_agent',
        'details',
        'severity',
        'user_id',
    ];

    /**
     * Get the user associated with this alert.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
