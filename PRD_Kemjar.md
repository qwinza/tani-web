PRODUCT REQUIREMENT DOCUMENT (PRD)
Implementasi Keamanan Application Layer & Infrastruktur Sistem (Inertia.js Stack)

1. RINGKASAN PROYEK & TUJUAN
   Dokumen ini disusun sebagai spesifikasi kebutuhan teknis (PRD) untuk diimplementasikan oleh AI Agent /
   Developer (Antigravity). Tujuannya adalah memperkuat sebuah proyek aplikasi berbasis web yang
   menggunakan arsitektur Inertia.js guna memenuhi seluruh syarat wajib serta kriteria bonus dalam Ujian Akhir
   Semester (UAS) Keamanan Jaringan.
   Spesifikasi Stack Utama Aplikasi:
   Arsitektur: Inertia.js (Monolith rasa SPA, menjembatani Backend Server & Frontend SPA secara
   seamless).
   Environment Target: Ubuntu Linux (Production/Staging Server) & Kali Linux (Uji Penetrasi/Red
   Team).
2. MATRIKS KEBUTUHAN REKAYASA SISTEM
   No
   Fitur / Kebutuhan
   Keamanan
   Kategori
   Definisi Selesai / Cakupan Implementasi (Inertia.js
   Context)
   1 Password Hashing WAJIB Semua password user di dalam database harus di-hash
   menggunakan algoritma aman seperti Bcrypt atau
   Argon2id sebelum disimpan. Tidak boleh ada teks polos.
   2 Session Management WAJIB Konfigurasi session cookies dengan atribut keamanan
   tinggi: Secure (hanya lewat HTTPS), HttpOnly
   (mencegah pencurian token via XSS), dan
   SameSite=Lax atau Strict. Session timeout diatur
   maksimal 2 jam tidak aktif.
   3 Validasi Input WAJIB Validasi ketat di sisi backend untuk setiap request masuk
   (Form Request Validation). Skema tipe data, panjang
   karakter maksimum/minimum, format (email, UUID,
   numerik), dan whitelist karakter wajib diterapkan.
   4 Proteksi SQL Injection WAJIB Menggunakan ORM bawaan backend (seperti Laravel
   Eloquent / Spring Data JPA) yang secara default
   menggunakan Parameterized Queries / Prepared
   Statements. Melarang keras penggunaan raw query
   dinamis yang rentan.
   5 Proteksi XSS WAJIB Melakukan sanitasi output. Karena menggunakan Inertia.js
   (umumnya berpasangan dengan React/Vue), gunakan
   •
   •
   No
   Fitur / Kebutuhan
   Keamanan
   Kategori
   Definisi Selesai / Cakupan Implementasi (Inertia.js
   Context)
   mekanisme escape bawaan frontend. Gunakan library
   pembersih (misal: Purifier atau DOMPurify) jika ada
   input rich-text.

6 CSRF Protection WAJIB Inertia.js secara otomatis melampirkan token CSRF pada
request Axios. Antigravity harus memastikan middleware
CSRF aktif di backend dan memverifikasi token pada
setiap request mutasi (POST/PUT/PATCH/DELETE).

7 Rate Limiting & Brute
Force Prevention

WAJIB Menerapkan pembatasan request pada endpoint krusial
(Login, Register, Reset Password). Batasi maksimal 5
percobaan login per menit per alamat IP. Jika melanggar,
kembalikan HTTP Status 429 (Too Many Requests).
8 Role-Based Access
Control (RBAC)

WAJIB Implementasi hak akses user berdasarkan peran (contoh:
Admin, Staff, User). Proteksi route backend menggunakan
middleware otorisasi khusus dan pastikan sirkulasi data ke
frontend Inertia (`Inertia::share`) terfilter sesuai hak akses.
9 Secure File Upload WAJIB Validasi berkas unggahan: batasi tipe MIME yang diizinkan
(whitelist), batasi ukuran maksimum berkas (misal: 2MB),
ubah nama file asli menjadi string acak (UUID/Hash), dan
simpan file di luar direktori eksekusi publik.

10 Logging, Monitoring,
Suricata, Wazuh &
Telegram

WAJIB Instalasi Suricata (IDS/IPS jaringan) dan Wazuh Agent/
Manager pada infrastruktur OS Ubuntu. Konfigurasikan
pendeteksian anomali sistem/log server dan integrasikan
modul alert Wazuh ke bot Telegram via webhook API.
11 JWT Security BONUS VA Jika aplikasi menggunakan API stateless, pastikan JWT di-
sign menggunakan algoritma kuat (RS256/HS256) dengan
secret key yang kompleks di file .env. Simpan JWT di
dalam HTTP-Only cookie, bukan LocalStorage.

12 MFA / 2FA BONUS VA Menambahkan fitur Autentikasi Dua Faktor berbasis waktu
(TOTP) opsional bagi pengguna menggunakan aplikasi
authenticator seperti Google Authenticator.

13 WAF Sederhana & IDS/
IPS

BONUS VA Implementasi Web Application Firewall di server reverse
proxy menggunakan **ModSecurity** yang menempel
pada Nginx/Apache untuk memfilter payload eksploitasi
web umum secara real-time.
14 Enkripsi Data Sensitif BONUS VA Enkripsi kolom database yang menampung data pribadi
(PII) seperti nomor telepon, alamat, atau NIK
menggunakan algoritma enkripsi simetris (AES-256-GCM)
di level aplikasi.

15 Docker Security BONUS VA

No
Fitur / Kebutuhan
Keamanan
Kategori
Definisi Selesai / Cakupan Implementasi (Inertia.js
Context)
Kontenisasi aplikasi menggunakan Docker. Jalankan
container sebagai user non-root, gunakan base image
minimal (alpine), batasi resource container (CPU & RAM),
dan pastikan tidak ada secret key yang bocor di Dockerfile.
16 Reverse Proxy
Security & HTTPS/TLS
BONUS VA Gunakan Nginx sebagai Reverse Proxy di depan aplikasi.
Konfigurasikan sertifikat SSL/TLS (Let's Encrypt / Self-
Signed untuk lab), matikan protokol TLS versi usang
(hanya izinkan TLS 1.2 dan TLS 1.3), serta suntikkan
security headers. 3. DETAIL TEKNIS IMPLEMENTASI APPLICATION LAYER (INERTIA.JS
STACK)
3.1. Penanganan Input, Validasi, dan Proteksi SQLi & CSRF
Setiap input dari frontend Inertia.js wajib masuk ke layer validasi backend sebelum menyentuh logika bisnis
atau query database. Struktur penulisan kode harus mengikuti pola pengamanan berikut:
// Contoh implementasi standar keamanan tinggi pada Controller Backend
public function store(Request $request) {
// 1. Validasi Input Ketat (Input Validation)
$validatedData = $request->validate([
'username' => 'required|string|alpha_dash|max:50',
'email' => 'required|email|max:255|unique:users',
'password' => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/
[0-9]/',
]);
// 2. Password Hashing (Bcrypt/Argon2id secara eksplisit atau otomatis lewat cast)
$validatedData['password'] = Hash::make($request->password);
// 3. Proteksi SQL Injection (Menggunakan Eloquent Parameterized Query)
User::create($validatedData);
return redirect()->route('dashboard');
}
3.2. Fitur Keamanan Khusus Berkas (Secure File Upload)
Untuk menghindari penyerang mengunggah berkas web-shell (misal: file .php atau .sh) yang dapat
dieksekusi di server, Antigravity harus menerapkan skema pemrosesan upload berikut:
MIME Whitelist: Hanya mengizinkan berkas dengan ekstensi spesifik (contoh: image/jpeg, image/
png, application/pdf).
Sanitasi Nama File: Nama berkas harus di-generate ulang di server menggunakan struktur UUID v4 atau
MD5 dari timestamp.
•
•
Penyimpanan Terisolasi: Berkas wajib diletakkan di dalam folder penyimpanan privat (non-executable),
dan sirkulasi aksesnya dijembatani melalui symlink atau controller khusus yang tidak mengeksekusi script. 4. DETAIL TEKNIS INFRASTRUKTUR SECURITY & REVERSE PROXY
4.1. Pengamanan Server Nginx & TLS (Reverse Proxy & HTTPS)
Antigravity wajib mengonfigurasi file server blok Nginx di Ubuntu Server untuk menutup celah kebocoran
informasi dan serangan man-in-the-middle dengan konfigurasi berikut:
server {
listen 443 ssl http2;
server_name website-uas.local;

# TLS Configuration (Bonus Kebutuhan HTTPS)

ssl_certificate /etc/ssl/certs/uas_server.crt;
ssl_certificate_key /etc/ssl/private/uas_server.key;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;

# HTTP Security Headers (Anti-XSS, Anti-Clickjacking, Anti-Sniffing)

add*header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-
inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" always;
location / {
proxy_pass http://127.0.0.1:8000; # Mengarah ke app layer backend
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
}
}
4.2. Arsitektur Logging & Monitoring (Suricata + Wazuh + Telegram)
Sistem deteksi dan pemantauan wajib dikonfigurasi dengan alur kerja arsitektur sebagai berikut:
Suricata: Berjalan di mode promisc untuk membaca traffic interface jaringan Ubuntu. Aturan (Rules)
difokuskan untuk mengenali pola port scanning (Nmap), Brute force SSH, dan injeksi SQL web.
Wazuh Agent: Melakukan log-forwarding berkas log kritis sistem aplikasi (/var/log/auth.log, /var/
log/nginx/access.log, dan log Suricata eve.json) ke Wazuh Manager.
Wazuh Manager (Alerting Module): Memiliki aturan klasifikasi tingkat bahaya alert (Level 1-16). Ketika
terdeteksi aktivitas berbahaya berskala tinggi (misal: alert serangan SQLi dari Suricata atau brute force
login terdeteksi berkali-kali), Wazuh memicu integrasi skrip webhook.
Telegram Notification: Webhook mengirimkan payload JSON berisi rincian serangan (Waktu, IP
Penyerang, Jenis Serangan, dan Target) ke API Bot Telegram sehingga tim pertahanan (Blue Team)
mendapatkan notifikasi instan.
•
Suricata: Berjalan di mode promisc untuk membaca traffic interface jaringan Ubuntu. Aturan (\_Rules*)
difokuskan untuk mengenali pola port scanning (Nmap), Brute force SSH, dan injeksi SQL web.
Wazuh Agent: Melakukan log-forwarding berkas log kritis sistem aplikasi (/var/log/auth.log, /var/
log/nginx/access.log, dan log Suricata eve.json) ke Wazuh Manager.
Wazuh Manager (Alerting Module): Memiliki aturan klasifikasi tingkat bahaya alert (Level 1-16). Ketika
terdeteksi aktivitas berbahaya berskala tinggi (misal: alert serangan SQLi dari Suricata atau brute force
login terdeteksi berkali-kali), Wazuh memicu integrasi skrip webhook.
Telegram Notification: Webhook mengirimkan payload JSON berisi rincian serangan (Waktu, IP
Penyerang, Jenis Serangan, dan Target) ke API Bot Telegram sehingga tim pertahanan (Blue Team)
mendapatkan notifikasi instan.

5. INSTRUKSI EKSEKUSI UNTUK ANTIGRAVITY (AI DEVELOPER)
   Perintah Kerja Utama:
   Pindai seluruh struktur codebase Inertia.js yang tersedia saat ini.
   Implementasikan middleware validasi, proteksi CSRF, proteksi XSS, SQLi, rate limiting, dan enkripsi
   sesuai standar keamanan bagian 3 dokumen ini.
   Hasilkan file konfigurasi server Nginx (nginx.conf) beserta script deployment untuk otomatisasi setup
   Suricata, Wazuh Agent, dan integrasi bot Telegram di lingkungan OS Ubuntu.
   Pastikan seluruh fungsi aplikasi tidak mengalami pemutusan (breaking changes) akibat sinkronisasi
   antara backend statis dengan frontend reaktif milik Inertia.js.
   Pindai seluruh struktur codebase Inertia.js yang tersedia saat ini.
   Implementasikan middleware validasi, proteksi CSRF, proteksi XSS, SQLi, rate limiting, dan enkripsi
   sesuai standar keamanan bagian 3 dokumen ini.
   Hasilkan file konfigurasi server Nginx (`nginx.conf`) beserta script deployment untuk otomatisasi setup
   Suricata, Wazuh Agent, dan integrasi bot Telegram di lingkungan OS Ubuntu.
   Pastikan seluruh fungsi aplikasi tidak mengalami pemutusan (_breaking changes_) akibat sinkronisasi
   antara backend statis dengan frontend reaktif milik Inertia.js.
