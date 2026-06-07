#!/usr/bin/env python3

# vuln_scanner.py - Automated Vulnerability Scanner (Kustom)
# Skrip untuk memindai celah keamanan dasar, keaktifan WAF, dan kelayakan Security Headers.
# Jalankan dengan: python vuln_scanner.py [TARGET_URL]

import sys
import urllib.request
import urllib.error

# Warna Output Terminal
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[0;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'

# Menentukan Target URL
target_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
target_url = target_url.rstrip('/')

print("=" * 60)
print(f"📊 {BLUE}MEMULAI AUTOMATED VULNERABILITY SCANNING{NC} 📊")
print(f"Target URL: {target_url}")
print("=" * 60)

# Helper Request
def test_url(url, data=None):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'VulnerabilityScanner/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.getcode(), response.info(), response.read().decode('utf-8', errors='ignore')
    except urllib.error.HTTPError as e:
        return e.code, e.headers, ""
    except Exception as e:
        return 0, {}, str(e)

# 1. PENGUJIAN KEBOCORAN DOKUMEN SENSITIF (.env, .git)
print(f"\n[*] {BLUE}Tahap 1: Pengujian Kebocoran File Sensitif{NC}")
sensitive_files = [
    ("/.env", "DB_CONNECTION"),
    ("/.git/config", "[core]"),
    ("/composer.json", "require"),
    ("/package.json", "dependencies")
]

for path, pattern in sensitive_files:
    url = f"{target_url}{path}"
    code, _, body = test_url(url)
    
    if code == 200 and (pattern in body or path == "/.env"):
        print(f"  [!] {RED}CRITICAL: File {path} dapat diakses secara publik!{NC} (Status: {code})")
    elif code == 403 or code == 404:
        print(f"  [V] {GREEN}OK: File {path} terlindungi.{NC} (Status: {code})")
    else:
        print(f"  [?] {YELLOW}Info: Akses ke {path} mengembalikan status {code}.{NC}")

# 2. PENGUJIAN HTTP SECURITY HEADERS
print(f"\n[*] {BLUE}Tahap 2: Pengujian HTTP Security Headers{NC}")
code, headers, _ = test_url(target_url)

if code != 0:
    security_headers = [
        "X-Frame-Options",
        "X-Content-Type-Options",
        "X-XSS-Protection",
        "Content-Security-Policy",
        "Strict-Transport-Security"
    ]
    
    for sh in security_headers:
        if sh in headers:
            print(f"  [V] {GREEN}FOUND: {sh} ({headers[sh]}){NC}")
        else:
            print(f"  [X] {RED}MISSING: {sh} tidak ditemukan!{NC}")
else:
    print(f"  [X] {RED}Gagal terhubung ke target URL untuk cek headers.{NC}")

# 3. VERIFIKASI KEAKTIFAN WAF (SQL INJECTION & XSS BYPASS TEST)
print(f"\n[*] {BLUE}Tahap 3: Verifikasi Sistem WAF (Aplikasi & ModSecurity){NC}")
attacks = [
    ("SQL Injection", "/api/products?search=1'+UNION+SELECT+null,null,null,null--"),
    ("SQL Injection OR", "/api/products?search=1'+OR+1=1--"),
    ("XSS Script Tag", "/api/products?search=<script>alert('xss')</script>"),
    ("XSS Event Handler", "/api/products?search=test'+onerror=alert(1)")
]

waf_blocked_count = 0
for name, path in attacks:
    url = f"{target_url}{path}"
    code, _, _ = test_url(url)
    
    if code == 403:
        print(f"  [V] {GREEN}BLOCKED: Pola {name} berhasil diblokir WAF.{NC} (Status: 403)")
        waf_blocked_count += 1
    elif code == 200:
        print(f"  [!] {RED}BYPASS: Payload {name} lolos tanpa blokir!{NC} (Status: 200)")
    else:
        print(f"  [?] {YELLOW}Info: Mengirim {name} mengembalikan status {code}.{NC}")

# RINGKASAN SCAN
print("\n" + "=" * 60)
print(f"📊 {BLUE}RINGKASAN SCANNING KEAMANAN{NC} 📊")
print("=" * 60)
if waf_blocked_count == len(attacks):
    print(f"🛡️  WAF Status: {GREEN}SEMPURNA (Semua payload diblokir 100%){NC}")
else:
    print(f"⚠️  WAF Status: {YELLOW}RENTAN (Hanya memblokir {waf_blocked_count}/{len(attacks)} payload){NC}")
print(f"Audit selesai.")
print("=" * 60)
