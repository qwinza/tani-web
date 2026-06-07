#!/usr/bin/env bash

# install_suricata.sh - Skrip instalasi & konfigurasi otomatis Suricata IDS/IPS
# Jalankan skrip ini dengan hak akses sudo/root di Ubuntu Server: sudo bash install_suricata.sh

set -e

# Warna untuk output log
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}[*] Memulai instalasi Suricata...${NC}"

# 1. Tambahkan Suricata PPA Repository
echo -e "${GREEN}[*] Menambahkan PPA Suricata...${NC}"
apt-get update -y
apt-get install -y software-properties-common
add-apt-repository -y ppa:oisf/suricata-stable
apt-get update -y

# 2. Instalasi Suricata & Tools pendukung
echo -e "${GREEN}[*] Mengunduh dan menginstal Suricata...${NC}"
apt-get install -y suricata jq net-tools

# 3. Deteksi interface jaringan utama
INTERFACE=$(ip route | grep default | awk '{print $5}' | head -n1)
if [ -z "$INTERFACE" ]; then
    INTERFACE="eth0"
fi
echo -e "${GREEN}[*] Menggunakan Network Interface: $INTERFACE${NC}"

# 4. Backup konfigurasi default
echo -e "${GREEN}[*] Backup konfigurasi default suricata.yaml...${NC}"
cp /etc/suricata/suricata.yaml /etc/suricata/suricata.yaml.bak

# 5. Konfigurasi interface di suricata.yaml secara dinamis
echo -e "${GREEN}[*] Mengatur interface jaringan utama di suricata.yaml...${NC}"
sed -i "s/interface: eth0/interface: $INTERFACE/g" /etc/suricata/suricata.yaml

# 6. Menambahkan custom rules ke /etc/suricata/rules/local.rules
echo -e "${GREEN}[*] Membuat rule deteksi kustom di local.rules...${NC}"
mkdir -p /etc/suricata/rules

cat << 'EOF' > /etc/suricata/rules/local.rules
# 1. Deteksi Nmap / Port Scanning
alert tcp any any -> $HOME_NET any (msg:"[UAS-IDS] DETECTED: TCP Port Scan (Nmap)"; flags:S; threshold:type threshold, track by_src, count 20, seconds 10; sid:1000001; rev:1;)

# 2. Deteksi Percobaan SSH Brute Force
alert tcp any any -> $HOME_NET 22 (msg:"[UAS-IDS] WARNING: SSH Brute Force Attempt"; flow:to_server,established; threshold:type threshold, track by_src, count 5, seconds 60; sid:1000002; rev:1;)

# 3. Deteksi SQL Injection pada Traffic HTTP
alert http any any -> $HOME_NET any (msg:"[UAS-IDS] CRITICAL: Web Attack - SQL Injection Pattern"; http.uri; content:"union select"; nocase; sid:1000003; rev:1;)
alert http any any -> $HOME_NET any (msg:"[UAS-IDS] CRITICAL: Web Attack - SQL Injection Pattern (OR 1=1)"; http.uri; content:"or 1=1"; nocase; sid:1000004; rev:1;)

# 4. Deteksi XSS pada Traffic HTTP
alert http any any -> $HOME_NET any (msg:"[UAS-IDS] CRITICAL: Web Attack - Cross-Site Scripting (XSS) Pattern"; http.uri; content:"<script>"; nocase; sid:1000005; rev:1;)
alert http any any -> $HOME_NET any (msg:"[UAS-IDS] CRITICAL: Web Attack - XSS onerror Handler"; http.uri; content:"onerror="; nocase; sid:1000006; rev:1;)
EOF

# 7. Memastikan custom rules dimasukkan dalam list load di suricata.yaml
if ! grep -q "local.rules" /etc/suricata/suricata.yaml; then
    echo -e "${GREEN}[*] Menghubungkan local.rules ke pemuatan konfigurasi suricata.yaml...${NC}"
    # Tambahkan path local rules di bagian rule-files jika belum ada
    sed -i '/rule-files:/a \  - /etc/suricata/rules/local.rules' /etc/suricata/suricata.yaml
fi

# 8. Download dan update official ruleset menggunakan suricata-update
echo -e "${GREEN}[*] Memperbarui Ruleset Suricata...${NC}"
suricata-update || true

# 9. Jalankan Suricata Service dan set autostart saat boot
echo -e "${GREEN}[*] Menjalankan layanan Suricata...${NC}"
systemctl daemon-reload
systemctl enable suricata
systemctl restart suricata

# 10. Status check
echo -e "${GREEN}[*] Memeriksa status Suricata...${NC}"
if systemctl is-active --quiet suricata; then
    echo -e "${GREEN}[V] Suricata sukses terpasang dan sedang berjalan!${NC}"
    echo -e "${GREEN}[V] Berkas log eve.json berada di: /var/log/suricata/eve.json${NC}"
else
    echo -e "${RED}[X] Terjadi kendala saat menjalankan Suricata. Periksa 'systemctl status suricata'${NC}"
fi
