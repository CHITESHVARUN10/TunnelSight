import os
import argparse
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib

def train_model(dataset_path, output_dir):
    print(f"[->] Loading dataset from: {dataset_path}")
    if not os.path.exists(dataset_path):
        print(f"[!] Error: Dataset not found at {dataset_path}")
        return

    df = pd.DataFrame()
    try:
        df = pd.read_csv(dataset_path)
    except Exception as e:
        print(f"[!] Error reading dataset: {e}")
        return
        
    if 'label' not in df.columns:
        print("[!] Error: 'label' column not found in the dataset.")
        return

    print(f"    Total rows loaded: {len(df)}")
    
    # 1. Preprocessing
    # Separate features (X) and target labels (y)
    # We drop non-feature columns if they exist (like 'pcap_file', 'window_id' in real pcaps)
    drop_cols = ['label', 'pcap_file', 'window_id']
    X = df.drop(columns=[col for col in drop_cols if col in df.columns])
    y = df['label']

    # Split into training and testing sets (80% train, 20% test)
    print("[->] Splitting data into 80% training and 20% testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Scale numeric features
    print("[->] Scaling features using StandardScaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 2. Model Training
    print("[->] Training Random Forest Classifier...")
    # Using 100 trees, random state for reproducibility
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(X_train_scaled, y_train)

    # 3. Evaluation
    print("[->] Evaluating model on test data...")
    y_pred = clf.predict(X_test_scaled)

    accuracy = accuracy_score(y_test, y_pred)
    # Using average='weighted' to account for any class imbalance
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')

    print("\n--- Model Performance Metrics ---")
    print(f"Accuracy : {accuracy * 100:.2f}%")
    print(f"Precision: {precision * 100:.2f}%")
    print(f"Recall   : {recall * 100:.2f}%")
    print(f"F1-Score : {f1 * 100:.2f}%")

    print("\n--- Confusion Matrix ---")
    labels = sorted(y.unique())
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    
    # Create a nice textual confusion matrix using Pandas DataFrame for alignment
    cm_df = pd.DataFrame(cm, index=[f"Actual {l}" for l in labels], columns=[f"Pred {l}" for l in labels])
    print(cm_df.to_string())

    # 4. Export Model and Scaler
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    model_path = os.path.join(output_dir, 'rf_model.pkl')
    scaler_path = os.path.join(output_dir, 'scaler.pkl')
    
    print("\n[->] Saving trained model and scaler...")
    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"[OK] Model saved to: {model_path}")
    print(f"[OK] Scaler saved to: {scaler_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train ML Traffic Classifier")
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
    
    args = parser.parse_args()
    
    # Resolve relative paths relative to this script's location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_abs_path = os.path.abspath(os.path.join(script_dir, args.dataset))
    output_abs_dir = os.path.abspath(os.path.join(script_dir, args.output_dir))
    
    train_model(dataset_abs_path, output_abs_dir)
