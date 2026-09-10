import os
import sys
import pandas as pd
import numpy as np
import joblib

def test_anomaly_model():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'if_model.pkl')
    scaler_path = os.path.join(script_dir, 'if_scaler.pkl')
    dataset_path = os.path.join(script_dir, '../../data/dataset.csv')

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print("[!] Error: Model or scaler not found. Run train_anomaly_model.py first.")
        return

    # Load model and scaler
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    print("[->] Running Anomaly Detection Test...")

    # 1. Test Normal Data
    print("\n[->] Testing with Normal Data (from dataset.csv)")
    df = pd.read_csv(dataset_path)
    normal_sample = df.sample(5, random_state=42)
    drop_cols = ['label', 'pcap_file', 'window_id']
    X_normal = normal_sample.drop(columns=[col for col in drop_cols if col in normal_sample.columns])
    actual_labels = normal_sample['label'].values if 'label' in normal_sample.columns else ["Unknown"] * 5

    X_normal_scaled = scaler.transform(X_normal)
    
    # Predict (-1 is anomaly, 1 is normal)
    preds_normal = model.predict(X_normal_scaled)
    # decision_function gives anomaly score (lower means more anomalous)
    scores_normal = model.decision_function(X_normal_scaled)

    print("-" * 65)
    print(f"{'#':<3} | {'PREDICTION':<12} | {'ANOMALY SCORE':<15} | {'ORIGINAL TRAFFIC':<20}")
    print("-" * 65)
    for i in range(len(preds_normal)):
        status = "NORMAL" if preds_normal[i] == 1 else "ANOMALY"
        print(f"{i+1:<3} | {status:<12} | {scores_normal[i]:>13.4f}   | {actual_labels[i]:<20}")

    # 2. Test Anomalous Data
    print("\n[->] Testing with Artificial Anomalous Data (Simulated Attacks)")
    # Generate some crazy data that doesn't match our normal distributions
    crazy_data = pd.DataFrame({
        "mean_packet_size":    [1500, 40, 1500, 64, 10],      # Too big or too small
        "median_packet_size":  [1500, 40, 1500, 64, 10],
        "std_packet_size":     [0, 0, 500, 0, 0],             
        "min_packet_size":     [1500, 40, 1000, 64, 10],
        "max_packet_size":     [1500, 40, 1500, 64, 10],
        "packets_per_second":  [10000, 50000, 1, 10000, 100], # Massive flood or weirdly slow
        "bytes_per_second":    [15000000, 2000000, 1500, 640000, 1000],
        "mean_iat":            [0.0001, 0.00002, 1.0, 0.0001, 0.01],
        "std_iat":             [0, 0, 0.5, 0, 0],
        "burstiness":          [0, 0, 0.5, 0, 0],
        "burst_count":         [0, 0, 0, 100, 0],
        "burst_duration":      [10, 10, 0, 5, 0],
        "upload_bytes":        [15000000, 2000000, 1500, 640000, 0],
        "download_bytes":      [0, 0, 0, 0, 1000],
        "ul_dl_ratio":         [100, 100, 100, 100, 0],       # Extremely one-sided
        "flow_duration":       [10, 10, 10, 10, 10],
        "total_packets":       [100000, 500000, 10, 100000, 1000],
        "total_bytes":         [150000000, 20000000, 15000, 6400000, 10000]
    })
    
    X_crazy_scaled = scaler.transform(crazy_data)
    preds_crazy = model.predict(X_crazy_scaled)
    scores_crazy = model.decision_function(X_crazy_scaled)

    descriptions = ["Flood Attack A", "Flood Attack B", "Slow Scan", "Bursty Flood", "Strange Tiny Packets"]
    
    print("-" * 65)
    print(f"{'#':<3} | {'PREDICTION':<12} | {'ANOMALY SCORE':<15} | {'SIMULATED TRAFFIC':<20}")
    print("-" * 65)
    for i in range(len(preds_crazy)):
        status = "NORMAL" if preds_crazy[i] == 1 else "ANOMALY"
        print(f"{i+1:<3} | {status:<12} | {scores_crazy[i]:>13.4f}   | {descriptions[i]:<20}")
    print("-" * 65)

if __name__ == "__main__":
    test_anomaly_model()
