import os
import argparse
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
import joblib

def train_anomaly_model(dataset_path, output_dir, contamination=0.05):
    print(f"[->] Loading dataset for anomaly detection from: {dataset_path}")
    if not os.path.exists(dataset_path):
        print(f"[!] Error: Dataset not found at {dataset_path}")
        return

    try:
        df = pd.read_csv(dataset_path)
    except Exception as e:
        print(f"[!] Error reading dataset: {e}")
        return

    print(f"    Total rows loaded: {len(df)}")
    
    # 1. Preprocessing
    drop_cols = ['label', 'pcap_file', 'window_id']
    X = df.drop(columns=[col for col in drop_cols if col in df.columns])

    print("[->] Scaling features using StandardScaler...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 2. Model Training
    print(f"[->] Training Isolation Forest (contamination={contamination})...")
    clf = IsolationForest(n_estimators=100, contamination=contamination, random_state=42, n_jobs=-1)
    clf.fit(X_scaled)

    # 3. Quick Sanity Check
    print("[->] Running a quick sanity check on the training data...")
    predictions = clf.predict(X_scaled)
    # -1 indicates anomaly, 1 indicates normal
    anomalies = sum(predictions == -1)
    normal = sum(predictions == 1)
    print(f"    Anomalies detected in training set: {anomalies} ({(anomalies/len(predictions))*100:.2f}%)")
    print(f"    Normal flows detected in training set: {normal}")

    # 4. Export Model and Scaler
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    model_path = os.path.join(output_dir, 'if_model.pkl')
    scaler_path = os.path.join(output_dir, 'if_scaler.pkl')
    
    print("\n[->] Saving trained anomaly model and scaler...")
    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"[OK] Model saved to: {model_path}")
    print(f"[OK] Scaler saved to: {scaler_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train ML Anomaly Detector")
    parser.add_argument(
        "--dataset",
        default="../../data/dataset.csv",
        help="Path to the training dataset CSV"
    )
    parser.add_argument(
        "--output-dir",
        default=".",
        help="Directory to save the trained model (.pkl) files"
    )
    parser.add_argument(
        "--contamination",
        type=float,
        default=0.05,
        help="Expected proportion of anomalies in the dataset"
    )
    
    args = parser.parse_args()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_abs_path = os.path.abspath(os.path.join(script_dir, args.dataset))
    output_abs_dir = os.path.abspath(os.path.join(script_dir, args.output_dir))
    
    train_anomaly_model(dataset_abs_path, output_abs_dir, args.contamination)
