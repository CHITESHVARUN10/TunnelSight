# data/ — synthetic TRAINING data (Phase 0)

No real VPN/testbed needed yet. `generate.py` fakes flow statistics for
web / video / voip / icmp / email archetypes.

```bash
python data/generate.py --n 500 --out data/output/synthetic_flows.csv
```

Outputs:
- `output/synthetic_flows.csv` — feature rows for `ml/train.py`
- `output/metadata.csv` — `capture_id, mode, encryption, integrity, dh_group, pfs, ip_version, traffic_type, duration`

Ground truth = archetype parameter, not observed traffic. Document limitations here when dataset grows.
Real PCAP-derived features replace this in later phases (roadmap S5-S7).
