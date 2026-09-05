import subprocess
import os
import json

screens = [
    {
        "index": 10,
        "filename_prefix": "10_dataset_ipsec_testbed_console",
        "title": "Dataset & IPsec Testbed Console (Refined) — Engineering Laboratory",
        "id": "247b1fe396e447af9adacbfff8805137",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1Uiz5-mTrgz8TLhrNnfJblqkEa5qpObL2UUObEHRn0WNeaQaG3-2YnbPi9ayyYkcOXQLZxeKGNXSWOBc2tbYmUbB2V6KnrdHuJAVBKn0Uyppjn1kkuWnh98l5UkghVxjeFPDcBvyorYgkED19OEN4-tzvBfHxNzWavCV3vgIisyPJlFv6X3aCnc0W-oDE2b-zBMMfzaOytlZajkkFzsIeGM2Bh91F3bRAi38KsXL-Sl--g8NLRFDkAw3C8=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZjFlYmFlMzgwNzc5YTE2MTY1MDJmMmI5EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 11,
        "filename_prefix": "11_security_findings_threat_matrix_weak_vpn_07",
        "title": "Security Findings & Threat Matrix (Refined) — weak-vpn-07.pcap",
        "id": "47dbddccae084f7f8717357cba0a6502",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1W9F9n1VSQiK3hv_0aZ3BanNQZzctnIIiMs_4IYwRfuMjPYsysY2E8S_lEsneiHM0GglBDLwageI6JIkJbjG99OYI1p1_Dq7MsgYU9rb3mSeGNVCWL0GlMysE2Z5aoVBf2sV7oaEYbelFw2D6LEEX8Y8Q6eZt0-aXF8EubXx4VPdlJkOMQyFjuKSxNACCuc0tZPfpPbBA1WEiA5hcQKSY-QZKLoRA6NAMZrs2QC8bAVuRO7mFRF8Z_ZweL7=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZDQ4MWYzM2QwMWI0ZTVlNTAwMjBjNDI4EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 12,
        "filename_prefix": "12_security_report_center_weak_vpn_07",
        "title": "Security Report Center (Refined) — weak-vpn-07.pcap",
        "id": "9c3065941e4c4670a22f1cab78bfc029",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WV3VXjXvuLcioWOfKve1ejYPj3KJG2GoL6PBIi3L-RAw0TNhyyc1K27ABOrmNOgeVMByccCZN6Te5SC29YRu_GMee1l6cJx4CmQ7Tu2jzPb2-XAa7YpqK6rOfjkm5YJkWwo-qmAPVTOOniDd9WnA_wxwmUvlEfsKA5JA3ttBzHV5i-TkCjMvGueenEpp33oGAwJvuGMqa6uCtFxByLCVDUWQFZgPaD_iWHHOESEj259COMv6ydrVsHnsg=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZjk5NmQyNGYwMWE2MmRlMzYxM2E1ZWNiEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 13,
        "filename_prefix": "13_traffic_anomaly_detection_weak_vpn_07",
        "title": "Traffic Anomaly Detection (Refined) — weak-vpn-07.pcap",
        "id": "3f4290cbcdb346bb9dfabd2af96e58ba",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1V1iRs5W403MDdJ6Lss4bP04OebuVGWvI1r7qS02zYH7nLL4uZ0co4HBTCkJ5wyJPycvURbp_PzGAYmgJ6iGlAnp_dw9qAl8JWROkN9c7eMAYF6LmOiXeiMm7ramLJsHZAz_Rxc8V1_HSE_KRnNRBTVR-Gu1UBq7rx4uYaDYPLY6-x0MFmLSaLkBz1fw6nQjV1dxTrxlmJmn8CD91OrA4NoVfbf0WAXE9cieZWhx2LKFvQcQdHLAom3nhqx=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZjhmYzc0ZTYwNzc5YTA2YWZmMGE3MTBlEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 14,
        "filename_prefix": "14_ai_explanation_forensic_analyst_assist_weak_vpn_07",
        "title": "AI Explanation & Forensic Analyst Assist (Refined) — weak-vpn-07.pcap",
        "id": "b82390a01f4340ddaa5b3cb297b4f9ac",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1VZwmA6EbXiYl4EWsfoAJjr9oTljyOn_y6j6vwkWgHEB4omoY-kMRmQo18Rm7Cu6dasmULaPYz5btRXcJs8znTbDPEVNYaRmAJ2dU27vGkApFFJSTdOoe8r6Fc8wPgs9MBeMSoNEDfN8t7Oxsw2Xgc9GNL2kH_4THAWorXRIr9BgT4sf7mKSE0dSxxBiicaM5Wmx76BTtGjIfeLjJDI3W6s32wHfA6s9P2ESyuSfWFNqiI4MqR9AfC9Px9P=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMWU5NmVjYjYwN2M0ZGYzNGQyMzZlZGZjEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 15,
        "filename_prefix": "15_user_profile_analyst_identity_settings",
        "title": "User Profile — Analyst Identity & Settings",
        "id": "2c92d978ec5f4feeb3580f356fbf618f",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1U6B5RtxBOzjTp7Yb5aMEv8W3dkmUHQAiAYGbhXXkHeca5iw-2LqPUQaAsUgLNOKipgs-8-CNZTt06wflGb6jba6HJHDJ-uFvuJerRADrXdYvJCbeYBG5-RMZiSeMlBkmyZ2GJtxnOkUncWtuPXGQwxZUeek7Phydd4KNBn1JyhbGGFA1BYWru5YjomTI_QJxXPYUVPVm72R2iGJEhRbwllr1LG_r4ThVQR3bux4sfy8SG6RsXHoSYjZ6pb=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMjRlNjdiZTEwN2M0ZWViYzgwM2I0ZGMyEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 16,
        "filename_prefix": "16_tunnelsight_landing_page",
        "title": "TunnelSight — AI-Powered IPsec Security Intelligence",
        "id": "2f917ae7a0a44b11a9d777e8ccbbf458",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1VGnhUx4NlYq7YkNhM_fzx7b-lxLHcA--MxYuUg1-fd71Lh4l5zoa-oZqxss8tp4rOB2W7gouyAnIi9yTAj_EVA_Ytj249MH6wQ0GjA96fz4Kz8QNkd6Jicu8BoA0HQLaTpYZXxQSCroUjf3JRzUlhzYHyVXa3_oR_29KLI2g57pyICEFoLyjWKFQ6avw1xezGvMgv-MjmTG86_PsQef5QhYq9ynh54vX0NjDjuVUq0o8fu8z1W2d3BykE=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMmVjNGZhMGEwMWE2MGIzZWY3MWIwNTk4EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 17,
        "filename_prefix": "17_sign_in_tunnelsight_security",
        "title": "Sign In — TunnelSight IPsec Security Intelligence",
        "id": "b93fd8f54b8a46ac9e02ee0e6c31af91",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1XBZMjiSaLCRNgUFjXIvwJy7r0mV-qEwGB4SEYdi61PP7GTAYMoK7Wu6m41IO1-OvKwbkTH6jV28m1ieFO73HFo7XsaOt7X7tNsIOC0-Niikd_fZxhFZfuEAJW4AVCvxDgZVD9yxK5_oVl5MtWNtgdFelUji3nCVobdYREydqDSBA5TwCLZCb6WvGYpBbG1xL-DUfDTgiNMPYkEBm6UcaGE_sfsGnd42bnqUF-KyMzlhNfU7CW5Lsza_aJx=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMzFmOWIzNzcwNzc5YTA2YWZmMGE3MTBlEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 18,
        "filename_prefix": "18_create_account_tunnelsight_security",
        "title": "Create Account — TunnelSight IPsec Security Intelligence",
        "id": "377b426f99f64ed7b086078454306ea3",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WrQt_iDgbdk-AVqlyLoFeJ3Tl_grXqZPNvfEgN3iXZFGveqkhEOv0uOtShODlvMiPjUltZ4t3n629UOLurFATyOL1uG7T5_0LzvVSGQkjN6WdpWkBKVCgL051efgNnmfrQseL8KQuI__Prg3CXWGcjZ3mkxCavk0G5AuB1jhBVo4oHxdHj70tT76P17FrM28DUMRi4YP6R_yEuZFD7UZ-DSgCaVjLZohKFy1D_SvyPH2WXEUyfi1XKAFk=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMzRiM2FkMWIwMzgzODZkZjcyMTAxNjI2EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 19,
        "filename_prefix": "19_forgot_password_tunnelsight_security",
        "title": "Forgot Password — TunnelSight IPsec Security Intelligence",
        "id": "d960f475b8f84e5fba016e12388831ea",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1UPifgNlrZjFXRidfnuWs7i1ojqSSmFzAvfs3R-bnafxm1kymBq6zUR81kKP-gNC7ErOtKgTahE8t3VAZ6fLzCGzCcao5nP7Ycl5g3xtmWkzv2-o3ZuXBWPuZW2F9ZeHnVZKNI1mKNsPAs7z6DO93wOLMo7hOcVdgwhtyjwA3m4nReq7AHkQFfUd2i3MdXYVPXDgRta-UgPEJFQpocxKIQ2gngUVK-HIfKVJlU0xczdFsjsJNhF69EjZtnY=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMzU1MjIzOTIwMWE2MmQ5ZjZkMzBhOWU5EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    }
]

out_dir = "/Users/chiteshvarun/D-drive/TunnelSight/stitch_screen"
os.makedirs(out_dir, exist_ok=True)

manifest_path = os.path.join(out_dir, "manifest.json")
if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
else:
    manifest = []

for s in screens:
    prefix = s["filename_prefix"]
    html_path = os.path.join(out_dir, f"{prefix}.html")
    png_path = os.path.join(out_dir, f"{prefix}.png")
    
    print(f"Downloading [{s['index']}/19]: {s['title']}...")
    
    # Download HTML using curl -sSL
    subprocess.run(["curl", "-sSL", s["html_url"], "-o", html_path], check=True)
            
    # Download PNG using curl -sSL
    subprocess.run(["curl", "-sSL", s["screenshot_url"], "-o", png_path], check=True)
            
    manifest.append({
        "index": s["index"],
        "id": s["id"],
        "title": s["title"],
        "html_file": f"{prefix}.html",
        "png_file": f"{prefix}.png",
        "html_size_bytes": os.path.getsize(html_path),
        "png_size_bytes": os.path.getsize(png_path)
    })
    print(f"  -> Saved {html_path} ({os.path.getsize(html_path)} bytes)")
    print(f"  -> Saved {png_path} ({os.path.getsize(png_path)} bytes)")

with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print("\nFinished downloading all batch 2 screens successfully!")
