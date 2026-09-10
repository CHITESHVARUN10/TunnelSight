#!/bin/bash
# capture.sh - Automates IPsec traffic generation and PCAP capture using Docker

echo "[*] Starting the strongSwan IPsec Testbed..."
docker-compose up -d

echo "[*] Starting IPsec daemon on both nodes..."
docker exec vpn-gateway ipsec start
docker exec vpn-client ipsec start

echo "[*] Waiting 5 seconds for IPsec tunnel to establish..."
sleep 5

echo "[*] Starting tcpdump on vpn-gateway to capture ESP (encrypted) traffic..."
# Capture ESP traffic (protocol 50) and UDP 500/4500 (IKE/NAT-T) on the eth0 interface
docker exec -d vpn-gateway tcpdump -i eth0 -w /pcaps/ipsec_legacy.pcap esp or udp port 500 or udp port 4500

echo "[*] Generating ICMP ping traffic from vpn-client through the IPsec tunnel..."
docker exec vpn-client ping -c 10 10.0.0.10

echo "[*] Waiting 2 seconds for buffers to flush..."
sleep 2

echo "[*] Stopping tcpdump..."
docker exec vpn-gateway pkill tcpdump
sleep 2

echo "[*] Tearing down the testbed..."
docker-compose down

echo "[SUCCESS] PCAP saved to testbed/pcaps/ipsec_legacy.pcap!"
