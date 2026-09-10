import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import accuracy_score, classification_report
import sys

def generate_mock_data():
    np.random.seed(42)
    # 18 Features
    n = 200 # 200 normal samples, 20 anomaly samples
    
    data = {
        'mean_packet_size': np.random.uniform(100, 1500, n),
        'median_packet_size': np.random.uniform(100, 1500, n),
        'std_packet_size': np.random.uniform(10, 300, n),
        'min_packet_size': np.random.uniform(40, 100, n),
        'max_packet_size': np.random.uniform(1000, 1500, n),
        'packets_per_second': np.random.uniform(10, 500, n),
        'bytes_per_second': np.random.uniform(1000, 500000, n),
        'mean_iat': np.random.uniform(0.001, 1.0, n),
        'std_iat': np.random.uniform(0.001, 0.5, n),
        'burstiness': np.random.uniform(0.1, 1.5, n),
        'burst_count': np.random.randint(0, 5, n),
        'burst_duration': np.random.uniform(0.0, 2.0, n),
        'upload_bytes': np.random.uniform(1000, 500000, n),
        'download_bytes': np.random.uniform(1000, 500000, n),
        'ul_dl_ratio': np.random.uniform(0.1, 5.0, n),
        'flow_duration': np.random.uniform(1.0, 10.0, n),
        'total_packets': np.random.randint(100, 5000, n),
        'total_bytes': np.random.randint(10000, 5000000, n),
    }
    
    df = pd.DataFrame(data)
    # Assign a fake label for classifier testing
    labels = np.random.choice(['video', 'web', 'voip', 'icmp', 'email'], n)
    
    # Inject anomalies
    anomaly_indices = np.random.choice(df.index, size=20, replace=False)
    df.loc[anomaly_indices, 'mean_packet_size'] *= 15  # Outlier
    df.loc[anomaly_indices, 'packets_per_second'] *= 30 # Outlier
    
    y_true_anomaly = [True if i in anomaly_indices else False for i in df.index]
    
    return df, labels, y_true_anomaly

def main():
    print("[->] Generating self-contained test dataset...")
    X, y_true_classifier, y_true_anomaly = generate_mock_data()

    print("[->] Loading Models...")
    try:
        rf_model = joblib.load("ml/traffic_classifier/rf_model.pkl")
        rf_scaler = joblib.load("ml/traffic_classifier/scaler.pkl")
        if_model = joblib.load("ml/anomaly_detector/if_model.pkl")
        if_scaler = joblib.load("ml/anomaly_detector/if_scaler.pkl")
    except Exception as e:
        print(f"[!] Error loading models: {e}")
        sys.exit(1)

    print("\n==========================================")
    print("1. EVALUATING RANDOM FOREST (CLASSIFIER)")
    print("==========================================")
    X_rf_scaled = rf_scaler.transform(X)
    y_pred_classifier = rf_model.predict(X_rf_scaled)
    
    acc = accuracy_score(y_true_classifier, y_pred_classifier)
    print(f"[*] Synthetic Data Classification Accuracy: {acc * 100:.2f}%\n")
    print(classification_report(y_true_classifier, y_pred_classifier))


    print("\n==========================================")
    print("2. EVALUATING ISOLATION FOREST (ANOMALY)")
    print("==========================================")
    X_if_scaled = if_scaler.transform(X)
    
    y_pred_anomaly_raw = if_model.predict(X_if_scaled)
    y_pred_anomaly = [True if x == -1 else False for x in y_pred_anomaly_raw]
    
    anomaly_acc = accuracy_score(y_true_anomaly, y_pred_anomaly)
    print(f"[*] Synthetic Anomaly Detection Accuracy: {anomaly_acc * 100:.2f}%\n")
    print(classification_report(y_true_anomaly, y_pred_anomaly, target_names=["Normal", "Anomaly"]))

if __name__ == "__main__":
    main()
