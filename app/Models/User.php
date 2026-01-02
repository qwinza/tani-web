<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    const ROLE_PETANI = 'petani';
    const ROLE_PEMBELI = 'pembeli';
    const ROLE_SUPERADMIN = 'superadmin';

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'is_active',
        'address',
        'latitude',
        'longitude',
    ];

    /**
     * Check if user has specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isPetani(): bool
    {
        return $this->hasRole(self::ROLE_PETANI);
    }

    public function isPembeli(): bool
    {
        return $this->hasRole(self::ROLE_PEMBELI);
    }

    public function isSuperadmin(): bool
    {
        return $this->hasRole(self::ROLE_SUPERADMIN);
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
