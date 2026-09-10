import argparse
import json
import sys
import os

# Add parent directory to path so we can import parser module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from parser.pcap_parser import parse_pcap_to_json

def main():
    parser = argparse.ArgumentParser(description="TunnelSight PCAP to JSON Parser")
    parser.add_argument("--pcap", required=True, help="Path to the PCAP file to parse")
    parser.add_argument("--output", help="Optional path to output the JSON file")
    
    args = parser.parse_args()
    
    print(f"[*] Starting extraction pipeline for {args.pcap}...")
    try:
        result_json = parse_pcap_to_json(args.pcap)
    except Exception as e:
        print(f"[!] Extraction failed: {e}")
        sys.exit(1)
        
    print("\n[+] Extraction Complete! Resulting JSON Configuration:")
    formatted_json = json.dumps(result_json, indent=4)
    print(formatted_json)
    
    if args.output:
        with open(args.output, "w") as f:
            f.write(formatted_json)
        print(f"\n[+] Output saved to {args.output}")

if __name__ == "__main__":
    main()
