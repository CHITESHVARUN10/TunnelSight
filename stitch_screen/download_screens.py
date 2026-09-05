import subprocess
import os
import json

screens = [
    {
        "index": 1,
        "filename_prefix": "01_analyzer_home_security_operations_overview",
        "title": "Analyzer Home / Security Operations Overview (Refined)",
        "id": "8a48578054234cca9db536ae8033af5c",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1W_ka8_uyhHkFS9pTQdJQXMWh6VMnfNKNLMOG_cDAIKaso1lO3rPTMrzWQ1EdxwdoK43IKMx7nK5M3ccU7FkRrOmmce7O_T8s-ovAR2xz7wrPGAkFJQ6urgIivMZ9JWz60PMw2Cs6wUYt_fS0mZLgfvZ__E8BRfeO8R4xjgCNA6rUVAkqs-4_WhUxJABRkwCy749hglaLcPKsJIWmI5Af6PXLf6FyUkoCgF51qFYp_QbT0T5hc22DjMBII=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlNGYyNzZjMGQwMmE5YWRlYjY3MjlkNDNlEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 2,
        "filename_prefix": "02_analyze_pcap_forensic_trace_ingestion",
        "title": "Analyze PCAP — Forensic Trace Ingestion (Refined)",
        "id": "f413545ce18045aea26efe70fda632fa",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1WM8cxkgsVMH_Rj5y5cffbBUlG1GszMWnAGLXOdE38aDEx5rynqx_tvMPcw9MFalFyBcBfgQlkuWsvkuS8MO9aacsIcKjMpqANcmYx5RCIoi6TgzQnHdmOVCMjDowRjGKUpM-D8JoNUiUz_cBcB43SdMYWZILgs1KdQOO7g-Z9g6JXobZQEXbwEdMEhk_Azohvj4w-t-0u-5XDAhFiJwmuXBdwQhFQe_rIerMeJMvgsIJYPvARgDbJtMDI=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlNGU1N2ZjNGMwNmZmYzkwYzZhMjI3YzQ0EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 3,
        "filename_prefix": "03_analysis_in_progress_forensic_pipeline_execution",
        "title": "Analysis in Progress — Forensic Pipeline Execution (Refined)",
        "id": "0b6850745fca4b72927707239a12f5dd",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1VKwWiLYtiOqeHTHbZLWr0Nfr5xrVMIGOz8f2lDMtuxrIny3jEpsNz3iDbZqmiY56I4g2mC0RxzWzPOk6zduQtfOdyFSnnCnTpdIyVPyhEsUCblecYkJuIUqjSNHzy5GgM1_WFw9mPT1jU58raxA7sOKigasP67Ez7E1RXU0A3oecR-MD3xvizp8ndh1GACFgjsQXEb40B_21_eBq0Kjpl-qg2B9gimwUYZjjH2o6I3n5atvelLbPVoJe7u=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlNTg4NWQxOGMwMWE2MGIzZWY3MWIwNTk4EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 4,
        "filename_prefix": "04_analysis_results_weak_vpn_07",
        "title": "Analysis Results — weak-vpn-07.pcap",
        "id": "70b599ea06fb49bcbad337fa20e507f5",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1VC7ApazZM7zeRo3aQF06l1g4wN8_rkNN_fGU-8uXN2GIF7gmYNCrCh1ocYKerH_FKStXSana9XOvcAC9EkV2YNaxQLOX_u0uCp66syZfjgIoSBY8j_EoRRaKz1G3vQ9JXfdNR8qOzB4iXz_QNbfYtYuOFu6j97k-6X9ILPv9EQha8LonOmDqL57TJg2_vJYZg_oT94obdFCyBeAMbUVPe1dsr3u-ScOVsjC7KRQmxruifgG_gqmikqDkel=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlNjM5ZGMyYzkwN2M0ZWViYzgwM2I0ZGMyEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 5,
        "filename_prefix": "05_vpn_configuration_protocol_details_weak_vpn_07",
        "title": "VPN Configuration & Protocol Details — weak-vpn-07.pcap",
        "id": "a035ca26715e401b8db94b99697f57bb",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1Uc829nU6vovbfBnQqytETRdRaoINzQIXK8ijlSSUMRgZEUVIWfpuvOcyajytLY0xBtco7TmHlKgCCPPP0_97U2iCRLS3X_A3R2kD79Wh5Ucs8Y705VlQoL0iZ6SjWYE5OSOG4OhblDuVB0hZEza1A0CDCVAm2lPax8JFIdXahX-i5BeYByEWMBMBKWtPURS5q8SY-tcKYKYKnteYws0ASCPKP0iSuKUkx-s_OPHSNr-xUQB_MTObc-2zkO=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZWM4ODM5YmYwMzM4NTg2OWFkMzk2Y2NhEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 6,
        "filename_prefix": "06_traffic_intelligence_weak_vpn_07",
        "title": "Traffic Intelligence — weak-vpn-07.pcap",
        "id": "070b49800937416a9a0263ddd0b278f8",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1U9MZDG78e4qnXQ0-ahz-QPv4eOXVDdGKiyyD751hmynvUDgJ_WSeaUCYyoBic_0YZiZwcu6tY8Y-RNhwdju7o8D6B4jIzu081NDn7lR_wV9jswc9_r06u_91wu2cGQeNbOskwHm2vgoqR6JzKGEf2tOPwRnS4fv8pGjB8YCJNphLJ9gGiUsZvgmV0Qpj5sjCMQ8rY8kpoU5J6sGWIqRtbV43K_wzh5-jxlCR4Lis-mSvtnb8olpo_0UVFf=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZWIyYTc0NGYwMzZjN2QwNjg5MTE1Y2I1EgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 7,
        "filename_prefix": "07_live_ipsec_analysis_continuous_interface_monitoring",
        "title": "Live IPsec Analysis (Refined) — Continuous Interface Monitoring (dpdk0)",
        "id": "d2cf989bce7c44168f850ef1ceca46e9",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1UauNyNXTmmxmcWADXWvBsXe2g_NfU8xk3ummRKP5tr1w4NkPKs8Xwj8wCsr4xrGBWJ87880XF-MlCqawU0NoFU6N-wtEvmAsS7kbBmjYezkw5PUqWhBRqH6il4wXqAjitDP1xswMkFQmeZZa61IZVO2ljvSNh7DQ0A1hyKbKPHw_chywB-zcIeQEaJsI9f9Z88EMMtHF2W8y8o06aOQnDVFzP_V7h2Yjx0CYA3TexON1lx2dJIH19sDSs=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZjEwNzViZTMwMmQzYzYwZDA3MTVjODgyEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 8,
        "filename_prefix": "08_vpn_configuration_comparison_deployment_posture_differential",
        "title": "VPN Configuration Comparison (Refined) — Deployment Posture Differential",
        "id": "7a2e48d7353c4078b38fc7bc2d55d792",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1Xryt3mRVdTtn9ZwAXWbHDwhjMGO5V3jFIcGu01LG3VUhQwGtFL98fsNj2N-zDD28tAgm12E2d1Xi_9vi3uZ4QVJAgXKoC-La7UJpheD9Du3A8lbZ4JrRkwxaBuDmeiR-ME__W8aSKY0QO9FCCUNJfyALrQplwdHvHpXJyc8rjccTbR7s8KbRQsU9--rN6vYomS46nH55qHflepl3f4lMbQo-JX3t9C3aqMiz56-Y7Ma-AKp371OLnSD4M=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZjBmNjFlMjYwMWI0ZTFhNWZlMmQyZjVhEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    },
    {
        "index": 9,
        "filename_prefix": "09_system_configuration_forensic_engine_settings",
        "title": "System Configuration & Forensic Engine Settings (Refined)",
        "id": "2bb0e7cba49b48b08beddb107f792215",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/AEtjO1UJrbGNu0H8iF5llI2F4Hvkss1oVJTdZ7_MAl6oKLmDfi3hdGUoS4jik0DXAiRzTyyhKjUD3CjmRwMAd75jwW4hKLtRNv40uSNzUFgDgySTbtcSnRYQyXVSj9kDsneftRuu1kjCs9jXEzX3Fpsah0ONL96ePJ1tQVYMu11b5soYorg8pJyz3m0MTaMTN1vTlOo-AdQBhiCo_PZpWIk328nGIq4eaMy5n82PLJdJ9kDw7HZnFfe_6tF1cEtn=s0",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWJlZjExNDlhYzEwN2M0ZDgxNTFhMWI2ZDkyEgsSBxCc8aXemRoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTQxMzE1MjkxNTI3NjY2OTE4MQ&filename=&opi=89354086"
    }
]

out_dir = "/Users/chiteshvarun/D-drive/TunnelSight/stitch_screen"
os.makedirs(out_dir, exist_ok=True)

manifest = []

for s in screens:
    prefix = s["filename_prefix"]
    html_path = os.path.join(out_dir, f"{prefix}.html")
    png_path = os.path.join(out_dir, f"{prefix}.png")
    
    print(f"Downloading [{s['index']}/9]: {s['title']}...")
    
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

manifest_path = os.path.join(out_dir, "manifest.json")
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print("\nFinished downloading all screens successfully!")
