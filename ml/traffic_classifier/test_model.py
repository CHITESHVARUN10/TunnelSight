import os
import sys
import pandas as pd
import joblib

def test_model(data_path, data_type="Seen"):
    print(f"\n[->] Testing with {data_type} Data from: {data_path}")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'rf_model.pkl')
    scaler_path = os.path.join(script_dir, 'scaler.pkl')

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print("[!] Error: Model or scaler not found. Run train_classifier.py first.")
        return

    # Load model and scaler
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    # Load data
    try:
        df = pd.read_csv(data_path)
    except Exception as e:
        print(f"[!] Error loading {data_path}: {e}")
        return

    # Grab 5 random samples
    sample_df = df.sample(5)
    
    # Separate features and actual labels
    drop_cols = ['label', 'pcap_file', 'window_id']
    X = sample_df.drop(columns=[col for col in drop_cols if col in sample_df.columns])
    actual_labels = sample_df['label'].values if 'label' in sample_df.columns else ["Unknown"] * 5

    # Scale the features
    X_scaled = scaler.transform(X)

    # Predict
    predictions = model.predict(X_scaled)
    probabilities = model.predict_proba(X_scaled)
    
    print("-" * 65)
    print(f"{'#':<3} | {'PREDICTION':<12} | {'CONFIDENCE':<12} | {'ACTUAL (Ground Truth)':<20}")
    print("-" * 65)
    
    for i in range(len(predictions)):
        pred = predictions[i]
        actual = actual_labels[i]
        confidence = max(probabilities[i]) * 100
        print(f"{i+1:<3} | {pred:<12} | {confidence:>6.2f}%      | {actual:<20}")
    print("-" * 65)

if __name__ == "__main__":
    # If a path is provided, test that. Otherwise, test default paths.
    if len(sys.argv) > 1:
        test_model(sys.argv[1], "Provided")
    else:
        # Default test 1: Seen Data
        seen_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../data/dataset.csv')
        test_model(seen_path, "Seen")
        
        # Default test 2: Unseen Data
        unseen_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../data/unseen_dataset.csv')
        if os.path.exists(unseen_path):
            test_model(unseen_path, "Unseen")
