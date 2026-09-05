import subprocess
import os
import json

screens = [
    {
        "index": 20,
        "filename_prefix": "20_reset_password_tunnelsight_security",
        "title": "Reset Password — TunnelSight IPsec Security Intelligence",
        "id": "e539370dcd84470ca60ff39c60a39dea",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1Vjm1BJbrUDRjOUY9wtlLX3ucD0HvFE9lnALhKTATC3OJaBlgXxula_bBc3YHeeYiq11oLv7HvIbjcrGHizBzdy0kKkCOKYnuJBXL0DgEMFEzx-X_UFEnM2ZdyjxscQ_Uq_PdDtGEnP4q0GMU0f1L16Ir7XYBKvWogI3MT7y5jxa4GXY1jz7DPq_SuUVgUK74BpxzmZ92lAwy-pPOF5UnPGQ8aE4wmogyScdHoCZ88DkTvDGxhfkqcqIbI6=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmMzgwMzNkMzkwNTc2MDJlNzQ2MDYyZWUzEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 21,
        "filename_prefix": "21_analysis_history_tunnelsight_security",
        "title": "Analysis History — TunnelSight IPsec Security Intelligence",
        "id": "a320732675ee4303891f399852f2fe84",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1V2mJqXe3AUoAek15Ldc4J_zmJQwjC5Th2o6S577y8hjQ6drWQRwyfnMbgDO-L1OwpJf4mbYYU0-sY_wRamqZqw768FvJQ7F29FS6pPnWbnQQk6dH0iSKGWihdw4sR3zSoUm7hEYo3jYyUtQ74YdhOJiJN6XuK8NQDD1QwvKv-yTUV8aER0vpinK4TVPhrzBZiPdgicfatOzkyZRQohNhWJeqcWZTUaKvwPrdTgI4462n-hAhyKnHMh_h3r=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmM2EwOTIzODgwMmE5YjMyN2IyMzI0ZWM3EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 22,
        "filename_prefix": "22_capture_detail_drawer_branch_emea_gw04",
        "title": "Capture Detail Drawer — branch-emea-gw04.pcap",
        "id": "bd043d843b9d4f42bde489e483814083",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1XA1d80JoQjhXykzOCTowK5yEHpolkN8Kzi8Vj2f1NR4qW74IQOQRpnIjHh6NI5L90FVbmask-FU4xySCwExaHXV7O1lncxFUjp_8n8Knn7MZoSmaV2KlZnEuUim39FKnLeKNpI1R_9qlH9PXKnPUAG8CyhQGuSdn_IXL_OBY8qzIEn9YWfpvcFWq9O2ij1yn5Iam1sXSROYQozKVKLv4JdzIq7oaMNzFLd2N9iovdYdXwhboxmAehj9IaX=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmM2Q1NGQxNzMwMzMyYzkyMTEzMmZhMzI2EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 23,
        "filename_prefix": "23_global_search_overlay_tunnelsight_technical_lookup",
        "title": "Global Search Overlay — TunnelSight Technical Lookup",
        "id": "76372f26070c4e16ba355ca4011cf350",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WNdmh8XemY0eoMgKsunD0fnLgFrH9HqMSK2Y6CREGChRV93ytG-se8UQLa-XIm16xsulEW-M_gSckt6W5HsuwCeMFH-Ir3Wa3ItXyf-yIcyebyXA4pe6903m5a-Zi6eUpoW11Yr5cT5h3_R5N_GrUcC6TQIWjfjd8oc4rtxdHfYQ4wsJw42i5RhxbqONXlj5gwwZusAM1_Gy_RhOJNrc0oXyVE7IRbIpYmUeI2a2Vwlz7qsRCs7ZRgBJln=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmM2YxMjJjM2MwNzNhZmIxODY4MjE1OGM1EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 24,
        "filename_prefix": "24_command_palette_tunnelsight_security",
        "title": "Command Palette — TunnelSight IPsec Security Intelligence",
        "id": "cddd11ecb9f04888a8c92205d33a52eb",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1UT7EHMncZ1Cl4JcQhpTSeicT5igGDWm5qHAC56cUrlsQ1V9-lmusVML2yFQZ80P6w9q7Lok88A3MfFSbBCYvRSo8mDyb5KFqJIoWvyTIryGwuOGxbN4xOhKxQwC1pvedool4znBGbsR7s4Vgak3NpRyJmJFVD4EeaOj4PBlkRm8pKu_KxIMFZs8pD-zKJuYCIZSxbwevRlh7YSo3loH4MeOSW9y7FllnW76DuqoorQYtSCuQgyTw8KEY_R=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmNDBiOTA3NGUwMjA3OWFhNjNlMjcxOWQwEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 25,
        "filename_prefix": "25_archive_delete_confirmation_dialogs",
        "title": "Archive & Delete Confirmation Dialogs — TunnelSight",
        "id": "18acf19a06ac4413878a9fb016072b68",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1VUHDkf2wdEFWotO49wi7A5bWN0tNISc_kuF3VLqN9lbfL-bnRBdzqEYVgWUjqlULJwiPQH1uyZAL3tKHPHgBpX2rOdfA1wtL4NcSj3BVsAsppXZ7RY8IczAvr_Oc1ZTLlO1SIC2Wy87DyR6X0bQtSlSKa2A6Az1w06ThZFEcGSybI067klEzQ04yq9Yg8xzKQndaGvyaM5TnfOWbGNPUVV2FdGYLhfTmRVZnWNr_f7KXGi66eFnPyNd2Q=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmNDBkYThjNjcwMWE2MmRlMzYxM2E1ZWNiEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 26,
        "filename_prefix": "26_live_analysis_confirmation_dialogs",
        "title": "Live Analysis Confirmation Dialogs — Start & Stop",
        "id": "2ce3f569cf8d4df78880e1689d1adaac",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1W4WEK28LsqUwnRQAy8qffE5PrrHyg7xJ8gaZH33x9EA5yLdRnBvUCPwyDcVdyl_HtJ5wjJpN1fWbwEwkoBQLVuPqr0DJ7xNfqYYM_Jzd53Se0EnXy3WlJDB2p5q2f9ebY8zdWuwyskzXuOIouQz-5u_ICOJMLt1DK3t4rJVgiPphCjz_R9MG-Kcd2dEg_se-gSd2Ar_eoNEJg0ukqzu9Ed4nhJjed5KLzEHAOSw4WeWDu7sOwIaSp2C-g=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmNDBlNDNmOTUwMzM4NWI5ZmE3MjYzZWY3EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 27,
        "filename_prefix": "27_report_generation_insufficient_evidence_dialogs",
        "title": "Report Generation & Insufficient Evidence Dialogs — TunnelSight",
        "id": "a4c06c8543274ce2aea4ff3e4d570a5b",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WqEkTUk7TDagv-9eoyoeUjJhYKVKsP8pGeP907sKv9A4Nmh6aHog9cST9toJtrYAOzfCPzmKwSXVskpcZkvCJFC3oSCKMmb3DRQfqMTRY9g8RXeA8uSY3Wukp30cyxNCbw-9ahNYisF613yEXpf0Mr9UZ_c7womG4OeHl2KrxJmnu9HFA2vcgCQkwOryVIqvRiyW_JACToN5OU3kQqVxeLbtHe1T9DJvWmdINk1TdsEfD5REEmUAq-Jis=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJmNDIwZjkyMWQwMzM4NWI5ZmE3MjYzZWY3EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
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
    
    print(f"Downloading [{s['index']}/27]: {s['title']}...")
    
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

print("\nFinished downloading all batch 3 screens successfully!")
