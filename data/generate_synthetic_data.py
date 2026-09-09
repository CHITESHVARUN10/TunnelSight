"""
IPsec VPN Traffic Dataset Generator
=====================================
Takes a folder of labeled PCAPs and extracts flow-level features into a CSV.

Folder structure expected:
    pcaps/
    ├── video/
    │   ├── capture_001.pcap
    │   └── capture_002.pcap
    ├── web/
    │   ├── capture_001.pcap
    │   └── capture_002.pcap
    ├── voip/
    ├── icmp/
    └── email/

Output: dataset.csv  (one row per flow window, with label)
"""

import os
import json
import math
import argparse
import numpy as np
import pandas as pd
from scapy.all import rdpcap, IP, UDP, TCP
from scapy.layers.isakmp import ISAKMP     # IKE packets
from scapy.contrib.ikev2 import IKEv2      # IKEv2 packets (if available)

# ─────────────────────────────────────────────
#  Constants
# ─────────────────────────────────────────────

ESP_PROTOCOL    = 50    # IP protocol number for ESP
AH_PROTOCOL     = 51    # IP protocol number for AH
IKE_PORT        = 500   # UDP port for IKE
IKE_NAT_PORT    = 4500  # UDP port for IKE behind NAT

WINDOW_SIZE_SEC = 10    # seconds per analysis window
BURST_GAP_SEC   = 0.1  # gap threshold to define a burst


# ─────────────────────────────────────────────
#  Packet-level helpers
# ─────────────────────────────────────────────

def is_esp_packet(pkt):
    """Return True if this packet carries ESP payload."""
    return IP in pkt and pkt[IP].proto == ESP_PROTOCOL


def is_ike_packet(pkt):
    """Return True if this packet is IKE (v1 or v2) negotiation."""
    return UDP in pkt and pkt[UDP].dport in (IKE_PORT, IKE_NAT_PORT)


def get_packet_size(pkt):
    """Total IP packet size in bytes."""
    return len(pkt[IP]) if IP in pkt else len(pkt)


# ─────────────────────────────────────────────
#  Flow / window splitting
# ─────────────────────────────────────────────

def split_into_windows(packets, window_size=WINDOW_SIZE_SEC):
    """
    Split a list of (timestamp, size, direction) tuples into
    fixed-size time windows.  Returns a list of windows, each
    being a list of (timestamp, size, direction).
    """
    if not packets:
        return []

    start_time = packets[0][0]
    windows    = []
    current    = []

    for pkt in packets:
        t = pkt[0]
        if t - start_time >= window_size:
            if current:
                windows.append(current)
            current    = [pkt]
            start_time = t
        else:
            current.append(pkt)

    if current:
        windows.append(current)

    return windows


# ─────────────────────────────────────────────
#  Feature extraction — one window → one row
# ─────────────────────────────────────────────

def extract_features(window):
    """
    Given a window of (timestamp, size, direction) tuples,
    return a dict of numerical features.
    direction: 1 = upload (client→server), -1 = download (server→client)
    """
    if not window:
        return None

    timestamps  = [p[0] for p in window]
    sizes       = [p[1] for p in window]
    directions  = [p[2] for p in window]

    total_packets = len(sizes)
    total_bytes   = sum(sizes)
    duration      = (timestamps[-1] - timestamps[0]) if len(timestamps) > 1 else 1e-6
    duration      = max(duration, 1e-6)   # avoid div/0

    # Packet size stats
    mean_size   = np.mean(sizes)
    median_size = np.median(sizes)
    std_size    = np.std(sizes)
    min_size    = np.min(sizes)
    max_size    = np.max(sizes)

    # Rate features
    pps = total_packets / duration   # packets per second
    bps = total_bytes   / duration   # bytes per second

    # Inter-arrival time (IAT)
    iats = np.diff(timestamps) if len(timestamps) > 1 else [0.0]
    mean_iat = np.mean(iats)
    std_iat  = np.std(iats)

    # Burstiness  (coefficient of variation of IAT)
    burstiness = (std_iat / mean_iat) if mean_iat > 0 else 0.0

    # Burst detection
    burst_count    = 0
    burst_duration = 0.0
    in_burst       = False
    burst_start    = None

    for i, iat in enumerate(iats):
        if iat < BURST_GAP_SEC:
            if not in_burst:
                in_burst    = True
                burst_start = timestamps[i]
                burst_count += 1
        else:
            if in_burst:
                burst_duration += timestamps[i] - burst_start
                in_burst = False

    if in_burst and burst_start is not None:
        burst_duration += timestamps[-1] - burst_start

    # Directional features
    upload_bytes   = sum(s for s, d in zip(sizes, directions) if d ==  1)
    download_bytes = sum(s for s, d in zip(sizes, directions) if d == -1)
    ul_dl_ratio    = (upload_bytes / download_bytes) if download_bytes > 0 else float('inf')
    ul_dl_ratio    = min(ul_dl_ratio, 100.0)   # cap extreme values

    return {
        # Packet size
        "mean_packet_size":    mean_size,
        "median_packet_size":  median_size,
        "std_packet_size":     std_size,
        "min_packet_size":     min_size,
        "max_packet_size":     max_size,
        # Rate
        "packets_per_second":  pps,
        "bytes_per_second":    bps,
        # Timing
        "mean_iat":            mean_iat,
        "std_iat":             std_iat,
        "burstiness":          burstiness,
        "burst_count":         burst_count,
        "burst_duration":      burst_duration,
        # Directional
        "upload_bytes":        upload_bytes,
        "download_bytes":      download_bytes,
        "ul_dl_ratio":         ul_dl_ratio,
        # Flow level
        "flow_duration":       duration,
        "total_packets":       total_packets,
        "total_bytes":         total_bytes,
    }


# ─────────────────────────────────────────────
#  PCAP → feature rows
# ─────────────────────────────────────────────

def process_pcap(pcap_path, label, vpn_config=None, client_ip=None):
    """
    Read a PCAP, filter ESP packets, split into time windows,
    extract features per window, and return a list of row dicts.

    vpn_config: optional dict with keys like
        { "cipher": "AES-256-GCM", "dh_group": 19, "pfs": True, "mode": "tunnel" }
    """
    try:
        packets = rdpcap(pcap_path)
    except Exception as e:
        print(f"  [!] Could not read {pcap_path}: {e}")
        return []

    # Collect ESP packets with metadata
    esp_data = []
    for pkt in packets:
        if not is_esp_packet(pkt):
            continue

        ts        = float(pkt.time)
        size      = get_packet_size(pkt)

        # Infer direction from IP
        src = pkt[IP].src
        if client_ip:
            direction = 1 if src == client_ip else -1
        else:
            direction = 1 if src < pkt[IP].dst else -1   # rough heuristic

        esp_data.append((ts, size, direction))

    if not esp_data:
        print(f"  [!] No ESP packets found in {pcap_path}")
        return []

    esp_data.sort(key=lambda x: x[0])   # sort by timestamp

    # Split into windows
    windows = split_into_windows(esp_data, WINDOW_SIZE_SEC)

    rows = []
    for i, window in enumerate(windows):
        if len(window) < 10:             # skip tiny windows
            continue

        features = extract_features(window)
        if features is None:
            continue

        features["label"]       = label
        features["pcap_file"]   = os.path.basename(pcap_path)
        features["window_id"]   = i

        # Attach VPN config metadata if provided
        if vpn_config:
            features.update(vpn_config)

        rows.append(features)

    print(f"  [✓] {os.path.basename(pcap_path)} → {len(rows)} windows extracted")
    return rows


# ─────────────────────────────────────────────
#  Load optional per-PCAP config JSON
# ─────────────────────────────────────────────

def load_config(pcap_path):
    """
    If a matching .json metadata file exists next to the PCAP, load it.
    e.g.  capture_001.pcap  →  capture_001.json
    """
    json_path = os.path.splitext(pcap_path)[0] + ".json"
    if os.path.exists(json_path):
        with open(json_path) as f:
            return json.load(f)
    return {}


# ─────────────────────────────────────────────
#  Main pipeline
# ─────────────────────────────────────────────

def generate_dataset(pcap_root, output_csv, client_ip=None):
    """
    Walk pcap_root, process every .pcap file under a label subdirectory,
    collect all rows, and write to output_csv.

    Expected structure:
        pcap_root/
            video/  *.pcap
            web/    *.pcap
            voip/   *.pcap
            icmp/   *.pcap
            email/  *.pcap
    """
    all_rows = []

    if not os.path.isdir(pcap_root):
        print(f"[!] Directory not found: {pcap_root}")
        return

    for label in sorted(os.listdir(pcap_root)):
        label_dir = os.path.join(pcap_root, label)
        if not os.path.isdir(label_dir):
            continue

        pcap_files = [f for f in os.listdir(label_dir) if f.endswith(".pcap")]
        if not pcap_files:
            continue

        print(f"\n[→] Processing label: {label}  ({len(pcap_files)} files)")

        for fname in sorted(pcap_files):
            fpath      = os.path.join(label_dir, fname)
            vpn_config = load_config(fpath)
            rows       = process_pcap(fpath, label, vpn_config, client_ip)
            all_rows.extend(rows)

    if not all_rows:
        print("\n[!] No data collected. Check your PCAP folder and structure.")
        return

    df = pd.DataFrame(all_rows)

    # Move label to the last column (convention)
    cols = [c for c in df.columns if c != "label"] + ["label"]
    df   = df[cols]

    df.to_csv(output_csv, index=False)
    print(f"\n[✓] Dataset saved → {output_csv}")
    print(f"    Rows   : {len(df)}")
    print(f"    Columns: {len(df.columns)}")
    print(f"\n    Class distribution:")
    print(df["label"].value_counts().to_string())


# ─────────────────────────────────────────────
#  Quick synthetic test  (no real PCAPs needed)
# ─────────────────────────────────────────────

def generate_synthetic_sample_csv(output_csv, n_per_class=200):
    """
    Generates a synthetic dataset mimicking real traffic patterns.
    Useful for testing the ML pipeline before real PCAPs are ready.
    NOT a substitute for real captures — use only for early dev/testing.
    """
    print("[→] Generating synthetic sample dataset for dev/testing...")

    rng  = np.random.default_rng(42)
    rows = []

    profiles = {
        "video": dict(
            mean_packet_size   = (1200, 150),
            packets_per_second = (400,  80),
            bytes_per_second   = (500_000, 80_000),
            mean_iat           = (0.0025, 0.001),
            burstiness         = (0.3,  0.1),
            ul_dl_ratio        = (0.05, 0.02),     # heavy download
            burst_count        = (2,    1),
        ),
        "web": dict(
            mean_packet_size   = (600,  200),
            packets_per_second = (80,   40),
            bytes_per_second   = (50_000, 20_000),
            mean_iat           = (0.012, 0.008),
            burstiness         = (1.5,  0.5),       # bursty
            ul_dl_ratio        = (0.4,  0.2),
            burst_count        = (8,    3),
        ),
        "voip": dict(
            mean_packet_size   = (200,  30),         # small packets
            packets_per_second = (50,   5),          # very regular
            bytes_per_second   = (10_000, 1_500),
            mean_iat           = (0.02, 0.002),      # consistent IAT
            burstiness         = (0.1,  0.05),       # NOT bursty
            ul_dl_ratio        = (0.95, 0.1),        # balanced
            burst_count        = (1,    1),
        ),
        "icmp": dict(
            mean_packet_size   = (100,  20),
            packets_per_second = (10,   5),
            bytes_per_second   = (1_000, 500),
            mean_iat           = (1.0,  0.5),
            burstiness         = (0.2,  0.1),
            ul_dl_ratio        = (1.0,  0.05),
            burst_count        = (0,    1),
        ),
        "email": dict(
            mean_packet_size   = (800,  300),
            packets_per_second = (30,   20),
            bytes_per_second   = (25_000, 15_000),
            mean_iat           = (0.03, 0.02),
            burstiness         = (2.0,  0.8),
            ul_dl_ratio        = (1.5,  0.5),       # upload heavy
            burst_count        = (3,    2),
        ),
    }

    def sample(mean, std, n, low=0):
        # Base normal distribution
        vals = np.clip(rng.normal(mean, std, n), low, None)
        # Inject 5% random noise (outliers) to simulate real-world network fluctuations
        mask = rng.random(n) < 0.05
        if np.any(mask):
            noise = rng.uniform(0.5, 3.0, size=np.count_nonzero(mask))
            vals[mask] *= noise
        return vals

    for label, p in profiles.items():
        n = n_per_class
        pps  = sample(*p["packets_per_second"], n, 1)
        bps  = sample(*p["bytes_per_second"],   n, 100)
        ms   = sample(*p["mean_packet_size"],   n, 64)
        iat  = sample(*p["mean_iat"],           n, 0.0001)
        dur  = rng.uniform(8, 12, n)
        tp   = (pps * dur).astype(int)
        tb   = (bps * dur).astype(int)

        for i in range(n):
            rows.append({
                "mean_packet_size":    ms[i],
                "median_packet_size":  ms[i] * rng.uniform(0.9, 1.1),
                "std_packet_size":     ms[i] * rng.uniform(0.1, 0.4),
                "min_packet_size":     max(64, ms[i] * 0.3),
                "max_packet_size":     min(1500, ms[i] * 1.5),
                "packets_per_second":  pps[i],
                "bytes_per_second":    bps[i],
                "mean_iat":            iat[i],
                "std_iat":             iat[i] * sample(*p["burstiness"], 1)[0],
                "burstiness":          sample(*p["burstiness"], 1)[0],
                "burst_count":         max(0, int(sample(*p["burst_count"], 1)[0])),
                "burst_duration":      rng.uniform(0, 2),
                "upload_bytes":        tb[i] * sample(*p["ul_dl_ratio"], 1, 0.01)[0],
                "download_bytes":      tb[i],
                "ul_dl_ratio":         sample(*p["ul_dl_ratio"], 1, 0.01)[0],
                "flow_duration":       dur[i],
                "total_packets":       tp[i],
                "total_bytes":         tb[i],
                "label":               label,
            })

    df = pd.DataFrame(rows).sample(frac=1, random_state=42).reset_index(drop=True)
    df.to_csv(output_csv, index=False)

    print(f"[✓] Synthetic dataset saved → {output_csv}")
    print(f"    Rows: {len(df)}  |  Classes: {df['label'].value_counts().to_dict()}")
    return df


# ─────────────────────────────────────────────
#  Entry point
# ─────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="IPsec VPN Dataset Generator")
    parser.add_argument(
        "--pcap-dir",
        default="pcaps",
        help="Root folder containing label subfolders with .pcap files",
    )
    parser.add_argument(
        "--output",
        default="dataset.csv",
        help="Output CSV path",
    )
    parser.add_argument(
        "--synthetic",
        action="store_true",
        help="Generate a synthetic sample dataset (for testing before real PCAPs exist)",
    )
    parser.add_argument(
        "--synthetic-n",
        type=int,
        default=200,
        help="Number of synthetic samples per class (default 200)",
    )
    parser.add_argument(
        "--client-ip",
        default=None,
        help="Optional IP address of the VPN client to accurately determine upload vs download direction for real PCAPs",
    )
    args = parser.parse_args()

    if args.synthetic:
        generate_synthetic_sample_csv(args.output, args.synthetic_n)
    else:
        generate_dataset(args.pcap_dir, args.output, args.client_ip)