"""Canonical flow feature order for Isolation Forest (roadmap S13). Single source of truth."""

FEATURES = [
    "packet_count",
    "total_bytes",
    "mean_size",
    "median_size",
    "std_size",
    "min_size",
    "max_size",
    "packets_per_second",
    "bytes_per_second",
    "mean_iat",
    "std_iat",
    "burstiness",
    "burst_count",
    "burst_duration",
    "upload_bytes",
    "download_bytes",
    "up_down_ratio",
    "flow_duration",
]
