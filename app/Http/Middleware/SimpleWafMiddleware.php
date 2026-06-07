<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\SecurityAlert;
use Illuminate\Support\Facades\Auth;

class SimpleWafMiddleware
{
    /**
     * Handle an incoming request and check for SQLi or XSS payloads.
     */
    public function handle(Request $request, Closure $next)
    {
        $inputs = $request->all();

        // Standard SQL Injection regex patterns
        $sqliPatterns = [
            '/union\s+select/i',
            '/select\s+.*\s+from/i',
            '/insert\s+into/i',
            '/update\s+.*\s+set/i',
            '/delete\s+from/i',
            '/drop\s+table/i',
            '/or\s+\d+\s*=\s*\d+/i',
            '/\'--/i',
            '/\/\*/i',
            '/xp_cmdshell/i',
        ];

        // Standard Cross-Site Scripting (XSS) regex patterns
        $xssPatterns = [
            '/<script[^>]*>/i',
            '/javascript:/i',
            '/onerror\s*=/i',
            '/onload\s*=/i',
            '/alert\s*\(/i',
            '/eval\s*\(/i',
            '/src\s*=\s*[\'"]javascript:/i',
            '/document\.cookie/i',
            '/window\.location/i',
        ];

        foreach ($inputs as $key => $value) {
            if (is_array($value)) {
                // Flatten array inputs to strings recursively
                $value = json_encode($value);
            }

            if (is_string($value)) {
                // Check SQLi patterns
                foreach ($sqliPatterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        $this->logAlert('sql_injection', "Potential SQL Injection detected in param '{$key}': {$value}", 'critical', $request);
                        return response()->json([
                            'message' => 'Akses diblokir oleh WAF: Terdeteksi pola SQL Injection.'
                        ], 403);
                    }
                }

                // Check XSS patterns
                foreach ($xssPatterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        $this->logAlert('xss_attempt', "Potential XSS attack detected in param '{$key}': {$value}", 'high', $request);
                        return response()->json([
                            'message' => 'Akses diblokir oleh WAF: Terdeteksi pola Cross-Site Scripting (XSS).'
                        ], 403);
                    }
                }
            }
        }

        return $next($request);
    }

    /**
     * Log the security alert to database.
     */
    protected function logAlert(string $eventType, string $details, string $severity, Request $request): void
    {
        try {
            SecurityAlert::create([
                'event_type' => $eventType,
                'ip_address' => $request->ip() ?? '127.0.0.1',
                'user_agent' => $request->userAgent() ?? 'Unknown',
                'details' => $details,
                'severity' => $severity,
                'user_id' => Auth::id(),
            ]);
        } catch (\Exception $e) {
            // Silence log errors to not break application flow
            logger()->error('Failed to log WAF security alert: ' . $e->getMessage());
        }
    }
}
