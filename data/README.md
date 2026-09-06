# data/ — synthetic training data for the Isolation Forest (roadmap S5–S7, S13, S17)

Two pipelines exist. The packet-level one is the training source of truth;
the legacy row sampler is kept for quick smoke tests.

## Pipeline (run in order)

```bash
python data/simulate.py --n-normal 4200 --n-anomaly 800 --seed 42   # packets -> flows.csv
python data/split.py --seed 42                                      # -> train/val/test.csv
python ml/train.py --input data/output/train.csv                    # normals only
python ml/evaluate.py --test data/output/test.csv                   # metrics -> eval.json
python data/sessions.py --n 20                                      # mixed-traffic windows
```

## How simulation works (`simulate.py`)

Each flow is a list of `(timestamp, size_bytes, direction)` drawn from an
archetype process, then the 18 `ml/features.py` features are DERIVED from the
packets — so `mean_iat <-> pps`, `sizes <-> bytes`, `up/down` are consistent
by construction. Sizes include 30–60B simulated ESP overhead.

Normal archetypes (Isolation Forest training baseline):
- `web` — bursty ON/OFF gaps, mixed sizes, up fraction ~0.3
- `video` — sustained 1.2–4 Mbps, 1000–1400B, down-heavy (~0.08 up)
- `voip` — periodic 20ms ± jitter both directions, 120–220B
- `icmp` — 1pps echo request/reply pairs
- `email` — few large chunks separated by idle seconds
- `file_transfer` — sustained bulk download, ~1400B

Anomaly archetypes (evaluation only, never trained on):
- `flood` — 6000–12000 pps small packets (short 1.5–4s windows)
- `exfil` — sustained large upload, up ratio ~20:1
- `beacon` — rigid periodicity, near-zero jitter
- `scan` — regular tiny one-direction probes

Burstiness = `(std_iat - mean_iat) / (std_iat + mean_iat)`; bursts split on
gaps > 5× median IAT. Seeds: simulate 42, split 42, sessions 7. Split is
stratified by (label, traffic_type): 70/15/15.

## Mixed sessions (`sessions.py`, roadmap S12)

Continuous `Web(10s) -> Video(15s) -> Web(10s) -> VoIP(10s)` captures cut into
5s windows labeled by majority traffic — proves transition detection instead
of one-label-per-capture.

## Files

- `output/flows.csv` + `output/metadata.csv` — all simulated flows + S7 labels
- `output/{train,val,test}.csv` + `output/metadata_split.csv` — stratified splits
- `output/sessions.csv` — windowed mixed-traffic sessions
- `generate.py` — legacy row-level sampler (smoke tests only, not training)

## Limitations (defense notes)

Synthetic timing is idealized (no real NIC jitter, no real ESP padding,
no cross-traffic, no retransmits). Claims must stay scoped: *"the detector
achieved X recall at Y FPR on the held-out synthetic test set."* Retrain on
testbed PCAP features before any real-traffic claim.
