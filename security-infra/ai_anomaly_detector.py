#!/usr/bin/env python3

# ai_anomaly_detector.py - AI/Statistical Anomaly Detection Script
# Menganalisis log keamanan di database secara statistik (Z-Score) untuk mengidentifikasi anomali serangan (Brute Force / Scan).
# Jalankan dengan: python ai_anomaly_detector.py

import os
import re
import math
import urllib.request
import json

# Warna Output
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[0;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'

print("=" * 60)
print(f"🧠 {BLUE}AI & STATISTICAL ANOMALY DETECTOR SYSTEM{NC} 🧠")
print("=" * 60)

# 1. Parsing file .env untuk mengambil kredensial database
def load_env():
    env_data = {}
    if os.path.exists('.env'):
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    env_data[key.strip()] = val.strip().strip('"').strip("'")
    return env_data

env = load_env()
db_host = env.get('DB_HOST', '127.0.0.1')
db_user = env.get('DB_USERNAME', 'root')
db_pass = env.get('DB_PASSWORD', '')
db_name = env.get('DB_DATABASE', 'bertani-db')

print(f"[*] Menghubungkan ke database {db_name} di {db_host}...")

# 2. Mencoba memuat library mysql-connector atau fallback ke simulasi log analisis jika DB offline/driver tidak ada
try:
    import mysql.connector
    conn = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name
    )
    cursor = conn.cursor(dictionary=True)
    
    # Ambil data dari tabel security_alerts
    cursor.execute("SELECT ip_address, event_type, COUNT(*) as count FROM security_alerts GROUP BY ip_address, event_type")
    logs = cursor.fetchall()
    cursor.close()
    conn.close()
except Exception as e:
    print(f"  [!] {YELLOW}Pemberitahuan: MySQL driver tidak ditemukan atau DB offline. Menggunakan analisis simulasi data log...{NC}")
    # Mock data log untuk simulasi audit
    logs = [
        {"ip_address": "192.168.1.15", "event_type": "login_failed", "count": 2},
        {"ip_address": "192.168.1.15", "event_type": "sql_injection", "count": 1},
        {"ip_address": "10.0.0.8", "event_type": "login_failed", "count": 14}, # Anomali: Brute Force login
        {"ip_address": "127.0.0.1", "event_type": "xss_attempt", "count": 1},
        {"ip_address": "172.16.0.4", "event_type": "sql_injection", "count": 23}, # Anomali: SQLi Scan
    ]

# 3. ALGORITMA STATISTIK DETEKSI ANOMALI (Z-SCORE)
# Menghitung rata-rata (mean) dan standar deviasi (standard deviation) dari jumlah insiden per IP
counts = [log['count'] for log in logs]

if len(counts) < 2:
    print(f"  [V] {GREEN}Data log terlalu sedikit untuk analisis Z-Score. Status Sistem: Aman/Normal.{NC}")
    sys.exit(0)

mean = sum(counts) / len(counts)
variance = sum((x - mean) ** 2 for x in counts) / (len(counts) - 1)
std_dev = math.sqrt(variance)

if std_dev == 0:
    std_dev = 1  # Mencegah pembagian nol jika data seragam

print(f"[*] Analisis Baseline Statistik: Rata-rata Insiden = {mean:.2f}, Standar Deviasi = {std_dev:.2f}")
print("=" * 60)

anomaly_detected = False

for log in logs:
    ip = log['ip_address']
    event = log['event_type']
    count = log['count']
    
    # Hitung Z-Score (Jarak deviasi data dari nilai rata-rata)
    z_score = (count - mean) / std_dev
    
    # Threshold Z-Score > 1.5 dianggap sebagai anomali/anomali pencilan (outlier)
    if z_score > 1.5:
        anomaly_detected = True
        print(f"🚨 {RED}ANOMALI TERDETEKSI!{NC}")
        print(f"  - IP Address: {ip}")
        print(f"  - Tipe Event: {event.upper()}")
        print(f"  - Jumlah Kejadian: {count} kali")
        print(f"  - Z-Score: {z_score:.2f} (Melebihi batas toleransi > 1.5)")
        print(f"  - Klasifikasi: Potensi serangan {YELLOW}{'Brute Force / DoS' if event == 'login_failed' else 'Automated Web Scan'}{NC}")
        print("-" * 50)
        
        # Kirim notifikasi Telegram jika anomali bernilai tinggi
        telegram_token = env.get('TELEGRAM_BOT_TOKEN')
        telegram_chat = env.get('TELEGRAM_CHAT_ID')
        
        if telegram_token and telegram_chat:
            alert_msg = f"🧠 *AI ANOMALY DETECTOR REPORT* 🧠\n" \
                        f"----------------------------------------\n" \
                        f"⚠️ *Anomali Terdeteksi di Jaringan!*\n" \
                        f"▪️ *IP Penyerang:* `{ip}`\n" \
                        f"▪️ *Tipe Ancaman:* {event.upper()}\n" \
                        f"▪️ *Jumlah Sinyal:* {count} kali\n" \
                        f"▪️ *Deviasi (Z-Score):* {z_score:.2f}\n" \
                        f"▪️ *Tindakan:* Rekomendasi blokir IP permanen pada Firewall.\n"
            
            try:
                telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
                payload = {
                    "chat_id": telegram_chat,
                    "text": alert_msg,
                    "parse_mode": "Markdown"
                }
                req = urllib.request.Request(
                    telegram_url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                urllib.request.urlopen(req)
                print("  [+] Peringatan anomali telah terkirim ke Telegram.")
            except Exception as e:
                print(f"  [X] Gagal mengirim pesan ke Telegram: {e}")

if not anomaly_detected:
    print(f"  [V] {GREEN}Tidak ada anomali terdeteksi. Semua aktivitas IP berada dalam batas wajar.{NC}")

print("=" * 60)
print("Analisis selesai.")
print("=" * 60)
