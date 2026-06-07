#!/usr/bin/env bash

# install_wazuh_agent.sh - Skrip otomatisasi instalasi & konfigurasi Wazuh Agent di Ubuntu Client
# Jalankan skrip ini dengan hak akses sudo/root: sudo bash install_wazuh_agent.sh [WAZUH_MANAGER_IP]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

WAZUH_MANAGER_IP=$1

if [ -z "$WAZUH_MANAGER_IP" ]; then
    echo -e "${RED}[!] Error: Harap masukkan IP Wazuh Manager sebagai argumen pertama!${NC}"
    echo -e "Contoh: sudo bash install_wazuh_agent.sh 192.168.10.10"
    exit 1
fi

echo -e "${GREEN}[*] Mengunduh repository gpg key Wazuh...${NC}"
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import
chmod 644 /usr/share/keyrings/wazuh.gpg

echo -e "${GREEN}[*] Menambahkan repository APT paket wazuh...${NC}"
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list

apt-get update -y

# Instalasi Wazuh Agent
echo -e "${GREEN}[*] Mengunduh dan menginstal wazuh-agent...${NC}"
WAZUH_MANAGER="$WAZUH_MANAGER_IP" apt-get install wazuh-agent -y

# Mengatur log forwarding di /var/ossec/etc/ossec.conf
echo -e "${GREEN}[*] Mengonfigurasi Log Forwarding pada ossec.conf...${NC}"

# Backup konfigurasi default
cp /var/ossec/etc/ossec.conf /var/ossec/etc/ossec.conf.bak

# Tambahkan pemantauan log Nginx, Auth, Suricata, dan Laravel logs ke dalam ossec.conf
cat << 'EOF' >> /var/ossec/etc/ossec.conf

<!-- CUSTOM LOG COLLECTION FOR UAS KEMJAR -->
<ossec_config>
  <!-- Nginx Access Log -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/nginx/website-uas_access.log</location>
  </localfile>

  <!-- Nginx Error Log -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/nginx/website-uas_error.log</location>
  </localfile>

  <!-- Linux Authentication Log -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/auth.log</location>
  </localfile>

  <!-- Suricata IDS Alert JSON (eve.json) -->
  <localfile>
    <log_format>json</log_format>
    <location>/var/log/suricata/eve.json</location>
  </localfile>

  <!-- Laravel Security Log -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/www/bertani/storage/logs/laravel.log</location>
  </localfile>
</ossec_config>
EOF

# Restart agent dan aktifkan startup service
echo -e "${GREEN}[*] Menjalankan wazuh-agent...${NC}"
systemctl daemon-reload
systemctl enable wazuh-agent
systemctl restart wazuh-agent

echo -e "${GREEN}[V] Wazuh Agent berhasil diinstal dan dihubungkan ke Manager di $WAZUH_MANAGER_IP${NC}"
echo -e "${GREEN}[V] Pemantauan aktif untuk: /var/log/auth.log, /var/log/nginx, /var/log/suricata/eve.json, dan laravel.log${NC}"
