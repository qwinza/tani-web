<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SecurityAlert;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            try {
                SecurityAlert::create([
                    'event_type' => 'unauthorized_access',
                    'ip_address' => $request->ip() ?? '127.0.0.1',
                    'user_agent' => $request->userAgent() ?? 'Unknown',
                    'details' => 'User ID ' . (Auth::id() ?? 'Guest') . ' mencoba mengakses endpoint dengan hak akses \'' . $role . '\' pada URL: ' . $request->fullUrl(),
                    'severity' => 'high',
                    'user_id' => Auth::id(),
                ]);
            } catch (\Exception $e) {
                logger()->error('Failed to log unauthorized access alert: ' . $e->getMessage());
            }

            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
