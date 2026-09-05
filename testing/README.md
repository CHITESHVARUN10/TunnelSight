# testing/ — TEST fixtures (what you feed the system)

- `pcaps/` — sample `.pcap` files added later. Naming: `C03_web_001.pcap` (config_traffic_seq).
- `json/` — expected label per capture (roadmap S7), e.g. `capture_001.json`.
- `robustness/` — edge cases from roadmap S29: single-esp, esp-no-ike, ike-no-esp,
  partial, mixed-traffic, ipv6, corrupted. One subfolder or file per case.

Keep training data in `data/output/`, never here, to avoid train/test leakage (S17).
