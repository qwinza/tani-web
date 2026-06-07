<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|confirmed',
            'role' => 'required|string|in:petani,pembeli',
        ], [
            'name.regex' => 'Nama hanya boleh berisi huruf dan spasi.',
            'password.regex' => 'Password wajib mengandung huruf besar, huruf kecil, dan angka.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        Auth::login($user);

        return response()->json([
            'user' => $user,
            'message' => 'Registration successful',
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            try {
                \App\Models\SecurityAlert::create([
                    'event_type' => 'login_failed',
                    'ip_address' => $request->ip() ?? '127.0.0.1',
                    'user_agent' => $request->userAgent() ?? 'Unknown',
                    'details' => 'Gagal masuk menggunakan email: ' . $request->email,
                    'severity' => 'medium',
                ]);
            } catch (\Exception $e) {
                logger()->error('Failed to log failed login: ' . $e->getMessage());
            }

            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
            'message' => 'Login successful',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Get all users (Admin only)
     */
    public function allUsers()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    /**
     * Get public farmer list for map
     */
    public function getPublicFarmers()
    {
        return response()->json(User::where('role', 'petani')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'name', 'address', 'latitude', 'longitude', 'role']));
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $user->update($request->only(['name', 'address', 'latitude', 'longitude']));

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully'
        ]);
    }
}
