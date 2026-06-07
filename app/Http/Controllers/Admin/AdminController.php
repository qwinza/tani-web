<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get summary statistics for the dashboard.
     */
    public function getStats()
    {
        $totalUsers = User::count();
        $totalFarmers = User::where('role', User::ROLE_PETANI)->count();
        $pendingFarmers = User::where('role', User::ROLE_PETANI)->where('status', User::STATUS_PENDING)->count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        
        $userDistribution = [
            ['name' => 'Petani', 'value' => $totalFarmers],
            ['name' => 'Pembeli', 'value' => User::where('role', User::ROLE_PEMBELI)->count()],
            ['name' => 'Admin', 'value' => User::where('role', User::ROLE_SUPERADMIN)->count()],
        ];

        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalFarmers' => $totalFarmers,
                'pendingFarmers' => $pendingFarmers,
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'serverStatus' => 'Stable',
            ],
            'charts' => [
                'userDistribution' => $userDistribution,
            ],
            'recentUsers' => $recentUsers,
        ]);
    }

    /**
     * User Management
     */
    public function toggleUserStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return response()->json(['message' => 'Status user diperbarui', 'user' => $user]);
    }

    public function verifyFarmer(User $user, Request $request)
    {
        $request->validate(['status' => 'required|in:approved,rejected']);
        $user->update(['status' => $request->status]);
        return response()->json(['message' => 'Status verifikasi petani diperbarui', 'user' => $user]);
    }

    /**
     * Category Management
     */
    public function categories() { return response()->json(Category::all()); }
    
    public function storeCategory(Request $request) 
    {
        $request->validate(['name' => 'required|string|unique:categories']);
        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon
        ]);
        return response()->json($category, 201);
    }

    public function deleteCategory(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Kategori dihapus']);
    }

    /**
     * Order Monitoring
     */
    public function orders()
    {
        return response()->json(Order::with(['buyer:id,name', 'product:id,name'])->orderBy('created_at', 'desc')->get());
    }

    /**
     * Announcement System
     */
    public function announcements() { return response()->json(Announcement::orderBy('created_at', 'desc')->get()); }

    public function postAnnouncement(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|in:all,petani,pembeli'
        ]);

        $announcement = Announcement::create($request->all());
        return response()->json($announcement, 201);
    }

    /**
     * Get security alerts (Admin only)
     */
    public function getSecurityAlerts()
    {
        $alerts = \App\Models\SecurityAlert::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($alerts);
    }

    /**
     * Simulate a security alert for testing/demonstration.
     */
    public function simulateAlert(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:sql_injection,xss_attempt,login_failed,unauthorized_access,file_upload_blocked',
            'severity' => 'required|string|in:low,medium,high,critical',
            'details' => 'required|string',
        ]);

        $alert = \App\Models\SecurityAlert::create([
            'event_type' => $request->type,
            'ip_address' => $request->ip() ?? '127.0.0.1',
            'user_agent' => $request->userAgent() ?? 'Simulated Browser',
            'details' => '[SIMULASI] ' . $request->details,
            'severity' => $request->severity,
            'user_id' => auth()->id(),
        ]);

        $this->notifyTelegram($alert);

        return response()->json([
            'success' => true,
            'message' => 'Simulasi alert keamanan berhasil dicatat dan dikirim ke bot Telegram.',
            'alert' => $alert
        ]);
    }

    /**
     * Direct notification helper for app-level critical alerts.
     */
    protected function notifyTelegram($alert)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$token || !$chatId) {
            return;
        }

        $message = "⚠️ *SECURITY ALERT SYSTEM* ⚠️\n";
        $message .= "--------------------------------------\n";
        $message .= "*Tipe Event:* " . strtoupper(str_replace('_', ' ', $alert->event_type)) . "\n";
        $message .= "*Bahaya:* " . strtoupper($alert->severity) . "\n";
        $message .= "*IP Penyerang:* " . $alert->ip_address . "\n";
        $message .= "*User Agent:* " . $alert->user_agent . "\n";
        $message .= "*Rincian:* " . $alert->details . "\n";
        $message .= "*Waktu:* " . $alert->created_at . "\n";

        try {
            $url = "https://api.telegram.org/bot{$token}/sendMessage";
            $client = new \GuzzleHttp\Client();
            $client->post($url, [
                'json' => [
                    'chat_id' => $chatId,
                    'text' => $message,
                    'parse_mode' => 'Markdown'
                ]
            ]);
        } catch (\Exception $e) {
            logger()->error('Telegram notification failed: ' . $e->getMessage());
        }
    }
}
