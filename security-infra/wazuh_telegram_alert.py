#!/usr/bin/env python3

# wazuh_telegram_alert.py - Integrasi Alert Wazuh Manager ke Telegram Bot
# Salin file ini ke server Wazuh Manager di: /var/ossec/integrations/custom-telegram
# Berikan izin eksekusi: chmod 750 /var/ossec/integrations/custom-telegram
# Kepemilikan berkas: chown root:ossec /var/ossec/integrations/custom-telegram

import sys
import json
import urllib.request

# Konfigurasi Default (Dapat ditimpa oleh argumen atau konfigurasi eksternal)
CHAT_ID = "YOUR_TELEGRAM_CHAT_ID"
BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"

# Wazuh memanggil script ini dengan format:
# script.py [alert_file_path] [api_key] [api_url]
alert_file = sys.argv[1]
telegram_token = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != "_" else BOT_TOKEN
chat_id = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != "_" else CHAT_ID

# Membaca alert JSON
try:
    with open(alert_file, 'r') as f:
        alert_json = json.loads(f.read())
except Exception as e:
    print(f"Error reading alert file: {e}")
    sys.exit(1)

# Mengambil data dari alert JSON
rule_id = alert_json.get('rule', {}).get('id', 'N/A')
rule_level = alert_json.get('rule', {}).get('level', 0)
rule_desc = alert_json.get('rule', {}).get('description', 'No description')
agent_name = alert_json.get('agent', {}).get('name', 'Unknown Agent')
agent_ip = alert_json.get('agent', {}).get('ip', 'N/A')

# Mengekstrak IP sumber penyerang (dari logs Nginx atau auth)
src_ip = alert_json.get('data', {}).get('srcip', '')
if not src_ip:
    src_ip = alert_json.get('data', {}).get('src_ip', '')
if not src_ip:
    # Cek log suricata
    src_ip = alert_json.get('data', {}).get('suricata', {}).get('src_ip', '')
if not src_ip:
    # Fallback ke log Nginx
    src_ip = alert_json.get('data', {}).get('clientip', 'N/A')

timestamp = alert_json.get('timestamp', 'N/A')

# Filter Level Alert (Kirim hanya alert dengan level >= 7 / Ancaman Sedang-Tinggi)
if int(rule_level) >= 7:
    # Memformat pesan Telegram (Markdown)
    message = "🚨 *WAZUH SECURITY ALERT DETECTED* 🚨\n"
    message += "----------------------------------------\n"
    message += f"▪️ *Tingkat Bahaya:* Level {rule_level}\n"
    message += f"▪️ *Deskripsi:* {rule_desc}\n"
    message += f"▪️ *ID Aturan:* {rule_id}\n"
    message += f"▪️ *IP Penyerang:* `{src_ip}`\n"
    message += f"▪️ *Nama Agent:* {agent_name} ({agent_ip})\n"
    message += f"▪️ *Waktu Kejadian:* {timestamp}\n"
    message += "----------------------------------------\n"
    
    # Menambahkan payload mentah jika level sangat kritis (>= 12)
    if int(rule_level) >= 12:
        full_log = alert_json.get('full_log', '')
        if full_log:
            message += f"📝 *Log Mentah:*\n`{full_log[:300]}`\n"

    # Mengirim request ke Telegram API
    telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }

    try:
        req = urllib.request.Request(
            telegram_url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print("Telegram alert sent successfully.")
    except Exception as e:
        print(f"Failed to send Telegram alert: {e}")
        sys.exit(1)
else:
    print(f"Alert ignored: Level {rule_level} is below threshold.")

    # Testing
