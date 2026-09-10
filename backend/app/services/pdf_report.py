"""Light, print-friendly PDF report built with ReportLab Platypus.

`build_report(row, windows, explanation)` returns raw PDF bytes for one analysis.
Every export surface in the app funnels through here so the document is identical
regardless of which button produced it.
"""

import io
from datetime import datetime, timezone
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#6B7280")
ACCENT = colors.HexColor("#0F766E")
RULE = colors.HexColor("#E5E7EB")
PANEL = colors.HexColor("#F9FAFB")

SEVERITY_COLORS = {
    "CRITICAL": colors.HexColor("#B91C1C"),
    "HIGH": colors.HexColor("#C2410C"),
    "MEDIUM": colors.HexColor("#B45309"),
    "LOW": colors.HexColor("#15803D"),
    "INFO": colors.HexColor("#4B5563"),
}

RISK_COLORS = {
    "CRITICAL": colors.HexColor("#B91C1C"),
    "HIGH": colors.HexColor("#C2410C"),
    "MEDIUM": colors.HexColor("#B45309"),
    "LOW": colors.HexColor("#15803D"),
}

MAX_WINDOW_ROWS = 15


def _styles() -> dict:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "TS_Title", parent=base["Title"], fontName="Helvetica-Bold",
            fontSize=20, leading=24, textColor=INK, alignment=TA_LEFT, spaceAfter=2,
        ),
        "subtitle": ParagraphStyle(
            "TS_Subtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=9.5, leading=13, textColor=MUTED,
        ),
        "h2": ParagraphStyle(
            "TS_H2", parent=base["Heading2"], fontName="Helvetica-Bold",
            fontSize=12, leading=15, textColor=ACCENT, spaceBefore=16, spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "TS_H3", parent=base["Heading3"], fontName="Helvetica-Bold",
            fontSize=10, leading=13, textColor=INK, spaceBefore=8, spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "TS_Body", parent=base["BodyText"], fontName="Helvetica",
            fontSize=9, leading=13, textColor=INK,
        ),
        "small": ParagraphStyle(
            "TS_Small", parent=base["BodyText"], fontName="Helvetica",
            fontSize=8, leading=11, textColor=MUTED,
        ),
        "cell": ParagraphStyle(
            "TS_Cell", parent=base["BodyText"], fontName="Helvetica",
            fontSize=8.5, leading=11.5, textColor=INK,
        ),
        "cellHead": ParagraphStyle(
            "TS_CellHead", parent=base["BodyText"], fontName="Helvetica-Bold",
            fontSize=8, leading=11, textColor=colors.white,
        ),
    }


def _esc(value) -> str:
    return escape("—" if value is None or value == "" else str(value))


def _fmt_int(value) -> str:
    try:
        return f"{int(value):,}"
    except (TypeError, ValueError):
        return "—"


def _fmt_bytes(value) -> str:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return "—"
    if n <= 0:
        return "—"
    for unit, div in (("GB", 1 << 30), ("MB", 1 << 20), ("KB", 1 << 10)):
        if n >= div:
            return f"{n / div:.1f} {unit}"
    return f"{n:.0f} B"


def _fmt_duration(seconds) -> str:
    try:
        s = float(seconds)
    except (TypeError, ValueError):
        return "—"
    if s < 1:
        return f"{s * 1000:.0f} ms"
    if s < 60:
        return f"{s:.2f} s"
    return f"{int(s // 60)}m {s % 60:.0f}s"


def _fmt_float(value, digits: int = 3) -> str:
    try:
        return f"{float(value):.{digits}f}"
    except (TypeError, ValueError):
        return "—"


def _kv_table(rows: list[tuple[str, str]], styles: dict, label_width: float = 1.9 * inch) -> Table:
    data = [
        [Paragraph(_esc(k), styles["small"]), Paragraph(_esc(v), styles["cell"])]
        for k, v in rows
    ]
    table = Table(data, colWidths=[label_width, 6.6 * inch - label_width])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("LINEBELOW", (0, 0), (-1, -2), 0.4, RULE),
            ]
        )
    )
    return table


def _score_bar(score: int | None, styles: dict) -> Table:
    if score is None:
        bar = Table([[Paragraph("Score unavailable", styles["small"])]], colWidths=[6.6 * inch])
        bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PANEL)]))
        return bar

    clamped = max(0, min(100, int(score)))
    filled = max(0.02, clamped / 100) * 6.6 * inch
    remaining = 6.6 * inch - filled
    color = ACCENT if clamped >= 70 else (colors.HexColor("#B45309") if clamped >= 40 else colors.HexColor("#B91C1C"))

    widths = [w for w in (filled, remaining) if w > 0.5]
    cells = [""] * len(widths)
    bar = Table([cells], colWidths=widths, rowHeights=[10])
    bar.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), color),
                ("BACKGROUND", (1, 0), (-1, -1), RULE),
                ("LINEBELOW", (0, 0), (-1, -1), 0, RULE),
            ]
        )
    )
    return bar


def _findings_table(findings: list[dict], styles: dict) -> Table:
    header = [
        Paragraph("Severity", styles["cellHead"]),
        Paragraph("Category", styles["cellHead"]),
        Paragraph("Description", styles["cellHead"]),
    ]
    data = [header]
    for f in findings:
        severity = (f.get("severity") or "INFO").upper()
        data.append(
            [
                Paragraph(f"<b>{_esc(severity)}</b>", styles["cell"]),
                Paragraph(_esc(f.get("category")), styles["cell"]),
                Paragraph(_esc(f.get("description")), styles["cell"]),
            ]
        )

    table = Table(data, colWidths=[0.75 * inch, 1.45 * inch, 4.4 * inch], repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 1), (-1, -1), 0.4, RULE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PANEL]),
    ]
    for i, f in enumerate(findings, start=1):
        severity = (f.get("severity") or "INFO").upper()
        style.append(("TEXTCOLOR", (0, i), (0, i), SEVERITY_COLORS.get(severity, SEVERITY_COLORS["INFO"])))
    table.setStyle(TableStyle(style))
    return table


def _windows_table(windows: list, styles: dict) -> Table:
    header = [
        Paragraph("Window", styles["cellHead"]),
        Paragraph("Span (s)", styles["cellHead"]),
        Paragraph("Packets", styles["cellHead"]),
        Paragraph("Traffic label", styles["cellHead"]),
        Paragraph("Confidence", styles["cellHead"]),
        Paragraph("Anomaly", styles["cellHead"]),
    ]
    data = [header]
    for w in windows[:MAX_WINDOW_ROWS]:
        span = None
        if w.window_start is not None and w.window_end is not None:
            span = w.window_end - w.window_start
        data.append(
            [
                Paragraph(f"W-{w.window_id + 1:02d}", styles["cell"]),
                Paragraph(_fmt_float(span, 2), styles["cell"]),
                Paragraph(_fmt_int(w.packet_count), styles["cell"]),
                Paragraph(_esc(w.traffic_label), styles["cell"]),
                Paragraph(
                    f"{w.traffic_confidence * 100:.1f}%" if w.traffic_confidence is not None else "—",
                    styles["cell"],
                ),
                Paragraph(_fmt_float(w.anomaly_score), styles["cell"]),
            ]
        )

    table = Table(data, colWidths=[0.8 * inch, 0.8 * inch, 0.95 * inch, 1.6 * inch, 1.15 * inch, 1.3 * inch], repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 1), (-1, -1), 0.4, RULE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PANEL]),
    ]
    for i, w in enumerate(windows[:MAX_WINDOW_ROWS], start=1):
        if w.is_anomaly:
            style.append(("TEXTCOLOR", (5, i), (5, i), SEVERITY_COLORS["CRITICAL"]))
    table.setStyle(TableStyle(style))
    return table


def _explanation_section(explanation: dict, styles: dict) -> list:
    flow = [
        Paragraph("AI Explanation", styles["h2"]),
        Paragraph(
            "AI-generated from the deterministic rule-engine evidence above. "
            "Treat as analyst assistance, not as a primary evidence source.",
            styles["small"],
        ),
        Spacer(1, 6),
    ]

    summary = explanation.get("summary")
    if summary:
        flow.append(Paragraph(_esc(summary), styles["body"]))
        flow.append(Spacer(1, 8))

    for item in explanation.get("per_finding") or []:
        block = [
            Paragraph(
                f"{_esc(item.get('category'))} "
                f"<font color='#6B7280'>[{_esc(item.get('severity'))}]</font>",
                styles["h3"],
            ),
        ]
        if item.get("why"):
            block.append(Paragraph(f"<b>Why it matters:</b> {_esc(item['why'])}", styles["body"]))
        if item.get("remediation"):
            block.append(Paragraph(f"<b>Remediation:</b> {_esc(item['remediation'])}", styles["body"]))
        flow.append(KeepTogether(block))
        flow.append(Spacer(1, 6))

    attribution = " · ".join(
        part
        for part in (
            f"Model: {explanation.get('model')}" if explanation.get("model") else None,
            f"Generated: {explanation.get('generated_at')}" if explanation.get("generated_at") else None,
        )
        if part
    )
    if attribution:
        flow.append(Paragraph(_esc(attribution), styles["small"]))
    return flow


def build_report(row, windows: list, explanation: dict | None = None) -> bytes:
    """Render one analysis into a styled, print-friendly PDF and return the bytes."""
    styles = _styles()
    buffer = io.BytesIO()

    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    stem = (row.filename or "capture").rsplit(".", 1)[0]

    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        leftMargin=0.95 * inch,
        rightMargin=0.95 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.85 * inch,
        title=f"TunnelSight Forensic Report — {row.filename}",
        author="TunnelSight",
        subject="IPsec capture analysis",
    )

    config = row.config_json or {}
    ipsec = config.get("ipsec_config") or {}
    crypto = ipsec.get("cryptography") or {}
    sa = ipsec.get("sa_config") or {}
    capture = config.get("capture") or {}
    findings = row.findings_json or []
    risk = (row.risk_level or "—").upper()
    risk_color = RISK_COLORS.get(risk, MUTED)

    flow = []

    # --- Cover header -------------------------------------------------------
    flow.append(Paragraph("TunnelSight Forensic Capture Report", styles["title"]))
    flow.append(
        Paragraph(
            f"{_esc(row.filename)} &nbsp;·&nbsp; Record {str(row.id)[:8].upper()} "
            f"&nbsp;·&nbsp; Generated {generated_at}",
            styles["subtitle"],
        )
    )
    flow.append(Spacer(1, 6))
    flow.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=12))

    # --- Executive summary --------------------------------------------------
    flow.append(Paragraph("Executive Summary", styles["h2"]))
    summary_rows = [
        ["Security score", f"{row.security_score if row.security_score is not None else '—'} / 100"],
        ["Risk level", risk],
        ["Evidence source", (config.get("evidence_source") or "unknown").upper()],
        ["Findings raised", str(len(findings))],
        ["Analysis status", (row.status or "unknown").upper()],
    ]
    summary_table = Table(
        [[Paragraph(_esc(k), styles["small"]), Paragraph(_esc(v), styles["cell"])] for k, v in summary_rows],
        colWidths=[1.9 * inch, 4.7 * inch],
    )
    summary_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LINEBELOW", (0, 0), (-1, -2), 0.4, RULE),
                ("TEXTCOLOR", (1, 1), (1, 1), risk_color),
            ]
        )
    )
    flow.append(summary_table)
    flow.append(Spacer(1, 8))
    flow.append(_score_bar(row.security_score, styles))
    flow.append(Spacer(1, 4))
    flow.append(Paragraph("0 — weakest &nbsp;·&nbsp; 100 — strongest", styles["small"]))

    if config.get("note"):
        flow.append(Spacer(1, 6))
        flow.append(Paragraph(_esc(config["note"]), styles["small"]))

    # --- Negotiated cryptography -------------------------------------------
    flow.append(Paragraph("Negotiated Cryptography", styles["h2"]))
    flow.append(
        _kv_table(
            [
                ("IKE version", sa.get("ike_version", "UNKNOWN")),
                ("Mode", sa.get("mode", "UNKNOWN")),
                ("Encryption", crypto.get("encryption_algorithm", "UNKNOWN")),
                ("Integrity", crypto.get("integrity_algorithm", "UNKNOWN")),
                ("Diffie-Hellman group", crypto.get("dh_group") if crypto.get("dh_group") else "UNKNOWN"),
                ("Forward secrecy (PFS)", "ENABLED" if crypto.get("pfs_enabled") else "DISABLED"),
                ("Anti-replay", "ENABLED" if sa.get("replay_protection", True) else "DISABLED"),
                ("SA lifetime", f"{sa.get('lifetime_seconds')}s" if sa.get("lifetime_seconds") else "UNKNOWN"),
            ],
            styles,
        )
    )

    # --- Capture statistics -------------------------------------------------
    flow.append(Paragraph("Capture Statistics", styles["h2"]))
    flow.append(
        _kv_table(
            [
                ("Packets", _fmt_int(capture.get("packet_count"))),
                ("Captured bytes", _fmt_bytes(capture.get("total_bytes"))),
                ("File size", _fmt_bytes(capture.get("file_bytes"))),
                ("Capture span", _fmt_duration(capture.get("flow_duration"))),
                ("First packet (UTC)", capture.get("started_at") or "—"),
                ("ML windows", str(config.get("windows_count", len(windows)))),
            ],
            styles,
        )
    )

    # --- Findings -----------------------------------------------------------
    flow.append(PageBreak())
    flow.append(Paragraph(f"Security Findings ({len(findings)})", styles["h2"]))
    if findings:
        flow.append(_findings_table(findings, styles))
    else:
        flow.append(
            Paragraph(
                "The deterministic rule engine raised no findings for this capture.",
                styles["body"],
            )
        )

    # --- Windows ------------------------------------------------------------
    flow.append(Paragraph("Encrypted Traffic Windows", styles["h2"]))
    if windows:
        flow.append(_windows_table(windows, styles))
        if len(windows) > MAX_WINDOW_ROWS:
            flow.append(Spacer(1, 4))
            flow.append(
                Paragraph(
                    f"Showing first {MAX_WINDOW_ROWS} of {len(windows)} windows. "
                    "Full series available via the API.",
                    styles["small"],
                )
            )
    else:
        flow.append(Paragraph("No ML windows were produced for this capture.", styles["body"]))

    # --- AI explanation (optional) -----------------------------------------
    if explanation:
        flow.append(PageBreak())
        flow.extend(_explanation_section(explanation, styles))

    # --- Footer -------------------------------------------------------------
    def _footer(canvas, doc_):
        canvas.saveState()
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        canvas.line(doc_.leftMargin, 0.7 * inch, LETTER[0] - doc_.rightMargin, 0.7 * inch)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(doc_.leftMargin, 0.55 * inch, f"TunnelSight · {stem} · generated {generated_at}")
        canvas.drawRightString(LETTER[0] - doc_.rightMargin, 0.55 * inch, f"Page {canvas.getPageNumber()}")
        canvas.restoreState()

    doc.build(flow, onFirstPage=_footer, onLaterPages=_footer)
    return buffer.getvalue()
