import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase.pdfmetrics import stringWidth


REPORT_DIR = "reports"

os.makedirs(REPORT_DIR, exist_ok=True)


# ============================================================
# COLORS
# ============================================================

NAVY = colors.HexColor("#0F172A")
DARK = colors.HexColor("#111827")
SLATE = colors.HexColor("#475569")
LIGHT_SLATE = colors.HexColor("#64748B")
BORDER = colors.HexColor("#CBD5E1")
LIGHT = colors.HexColor("#F8FAFC")
WHITE = colors.white

BLUE = colors.HexColor("#2563EB")
BLUE_LIGHT = colors.HexColor("#DBEAFE")

GREEN = colors.HexColor("#16A34A")
GREEN_LIGHT = colors.HexColor("#DCFCE7")

YELLOW = colors.HexColor("#D97706")
YELLOW_LIGHT = colors.HexColor("#FEF3C7")

RED = colors.HexColor("#DC2626")
RED_LIGHT = colors.HexColor("#FEE2E2")


# ============================================================
# HELPERS
# ============================================================

def safe(value, default="--"):
    if value is None:
        return default

    if isinstance(value, float):
        return f"{value:.2f}"

    return str(value)


def verdict_colors(verdict):

    verdict = str(verdict).upper()

    if verdict == "AUTHENTIC":
        return GREEN, GREEN_LIGHT

    if verdict == "DEEPFAKE":
        return RED, RED_LIGHT

    if verdict in ("AI GENERATED", "AI-GENERATED"):
        return RED, RED_LIGHT

    if verdict == "SUSPICIOUS":
        return YELLOW, YELLOW_LIGHT

    return SLATE, LIGHT


def verdict_description(verdict):

    verdict = str(verdict).upper()

    if verdict == "AUTHENTIC":
        return (
            "The analysis indicates a high probability that the "
            "submitted media is authentic."
        )

    if verdict == "SUSPICIOUS":
        return (
            "The analysis detected signals that require further "
            "verification. The media should not be treated as "
            "confirmed authentic."
        )

    if verdict in ("DEEPFAKE", "AI GENERATED", "AI-GENERATED"):
        return (
            "The analysis detected strong indicators associated "
            "with manipulated or AI-generated media."
        )

    return (
        "The analysis result could not be assigned to a standard "
        "classification."
    )


def get_score(result):

    try:
        return float(result.get("score", 0))
    except (TypeError, ValueError):
        return 0.0


# ============================================================
# HEADER / FOOTER
# ============================================================

def draw_header_footer(canvas, doc):

    canvas.saveState()

    width, height = A4

    # Header line
    canvas.setStrokeColor(BLUE)
    canvas.setLineWidth(2)
    canvas.line(
        18 * mm,
        height - 16 * mm,
        width - 18 * mm,
        height - 16 * mm
    )

    # Footer
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)

    canvas.line(
        18 * mm,
        14 * mm,
        width - 18 * mm,
        14 * mm
    )

    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(LIGHT_SLATE)

    canvas.drawString(
        18 * mm,
        9 * mm,
        "DeepVerify AI • AI-Powered Media Authenticity Analysis"
    )

    canvas.drawRightString(
        width - 18 * mm,
        9 * mm,
        f"Page {doc.page}"
    )

    canvas.restoreState()


# ============================================================
# SCORE BAR
# ============================================================

def score_bar(score):

    score = max(0, min(100, float(score)))

    total_width = 150 * mm
    bar_height = 7 * mm

    filled_width = total_width * score / 100

    data = [[""]]

    table = Table(
        data,
        colWidths=[total_width],
        rowHeights=[bar_height]
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                colors.HexColor("#E2E8F0")
            ),
            (
                "BOX",
                (0, 0),
                (-1, -1),
                0,
                colors.white
            ),
        ])
    )

    # Overlay using a nested table
    filled = Table(
        [[""]],
        colWidths=[max(filled_width, 0.1)],
        rowHeights=[bar_height]
    )

    filled.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                BLUE
            )
        ])
    )

    outer = Table(
        [[filled]],
        colWidths=[total_width],
        rowHeights=[bar_height]
    )

    outer.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                colors.HexColor("#E2E8F0")
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),
            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                0
            ),
            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                0
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                0
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                0
            ),
        ])
    )

    return outer


# ============================================================
# METRIC CARD
# ============================================================

def metric_card(title, value, subtitle=""):

    content = [
        Paragraph(
            title,
            ParagraphStyle(
                "metricTitle",
                fontName="Helvetica",
                fontSize=8,
                textColor=LIGHT_SLATE,
                spaceAfter=4,
            )
        ),
        Paragraph(
            str(value),
            ParagraphStyle(
                "metricValue",
                fontName="Helvetica-Bold",
                fontSize=16,
                textColor=DARK,
                spaceAfter=3,
            )
        ),
    ]

    if subtitle:
        content.append(
            Paragraph(
                subtitle,
                ParagraphStyle(
                    "metricSubtitle",
                    fontName="Helvetica",
                    fontSize=7,
                    textColor=LIGHT_SLATE,
                )
            )
        )

    table = Table(
        [[content]],
        colWidths=[55 * mm],
        rowHeights=[25 * mm]
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                LIGHT
            ),
            (
                "BOX",
                (0, 0),
                (-1, -1),
                0.7,
                BORDER
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),
            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                10
            ),
            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                10
            ),
        ])
    )

    return table


# ============================================================
# ANALYSIS ROW
# ============================================================

def analysis_row(name, value):

    return [
        Paragraph(
            name,
            ParagraphStyle(
                "analysisName",
                fontName="Helvetica",
                fontSize=9,
                textColor=SLATE,
            )
        ),
        Paragraph(
            safe(value),
            ParagraphStyle(
                "analysisValue",
                fontName="Helvetica-Bold",
                fontSize=9,
                textColor=DARK,
            )
        ),
    ]


# ============================================================
# MAIN REPORT GENERATOR
# ============================================================

def generate_report(
    scan_id,
    original_name,
    media_type,
    result
):

    filename = f"{scan_id}.pdf"

    filepath = os.path.join(
        REPORT_DIR,
        filename
    )

    score = get_score(result)

    verdict = result.get(
        "verdict",
        "UNKNOWN"
    )

    verdict_color, verdict_background = verdict_colors(
        verdict
    )

    generated_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # ========================================================
    # DOCUMENT
    # ========================================================

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=24 * mm,
        bottomMargin=20 * mm,
        title="DeepVerify AI Detection Report",
        author="DeepVerify AI",
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=25,
        leading=30,
        textColor=NAVY,
        alignment=TA_LEFT,
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=LIGHT_SLATE,
        spaceAfter=14,
    )

    section_style = ParagraphStyle(
        "Section",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=NAVY,
        spaceBefore=10,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "NormalReport",
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=SLATE,
    )

    small_style = ParagraphStyle(
        "Small",
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=LIGHT_SLATE,
    )

    # ========================================================
    # STORY
    # ========================================================

    story = []

    # --------------------------------------------------------
    # BRAND HEADER
    # --------------------------------------------------------

    brand = Table(
        [[
            Paragraph(
                "<b>DEEPVERIFY</b> <font color='#2563EB'>AI</font>",
                ParagraphStyle(
                    "Brand",
                    fontName="Helvetica-Bold",
                    fontSize=12,
                    textColor=NAVY,
                )
            ),
            Paragraph(
                "MEDIA AUTHENTICITY REPORT",
                ParagraphStyle(
                    "BrandRight",
                    fontName="Helvetica-Bold",
                    fontSize=7,
                    textColor=BLUE,
                    alignment=TA_RIGHT,
                )
            )
        ]],
        colWidths=[
            90 * mm,
            80 * mm
        ]
    )

    brand.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ])
    )

    story.append(brand)
    story.append(Spacer(1, 8))

    story.append(
        Paragraph(
            "Deepfake Detection Report",
            title_style
        )
    )

    story.append(
        Paragraph(
            "AI-powered analysis of uploaded media",
            subtitle_style
        )
    )

    # --------------------------------------------------------
    # VERDICT HERO CARD
    # --------------------------------------------------------

    verdict_block = Table(
        [[
            Paragraph(
                "<font size='8'>FINAL VERDICT</font><br/>"
                f"<font size='23'><b>{verdict}</b></font>",
                ParagraphStyle(
                    "VerdictHero",
                    fontName="Helvetica",
                    fontSize=9,
                    leading=22,
                    textColor=verdict_color,
                )
            ),

            Paragraph(
                f"<font size='8'>AUTHENTICITY SCORE</font><br/>"
                f"<font size='26'><b>{score:.2f}%</b></font>",
                ParagraphStyle(
                    "ScoreHero",
                    fontName="Helvetica",
                    fontSize=9,
                    leading=24,
                    textColor=NAVY,
                    alignment=TA_RIGHT,
                )
            )
        ]],
        colWidths=[
            85 * mm,
            85 * mm
        ]
    )

    verdict_block.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (0, 0),
                verdict_background
            ),
            (
                "BACKGROUND",
                (1, 0),
                (1, 0),
                LIGHT
            ),
            (
                "BOX",
                (0, 0),
                (-1, -1),
                0.8,
                BORDER
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),
            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                14
            ),
            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                14
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                10
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                10
            ),
        ])
    )

    story.append(verdict_block)
    story.append(Spacer(1, 6))

    story.append(score_bar(score))
    story.append(Spacer(1, 5))

    story.append(
        Paragraph(
            verdict_description(verdict),
            normal_style
        )
    )

    story.append(Spacer(1, 12))

    # --------------------------------------------------------
    # FILE INFORMATION
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "Scan Information",
            section_style
        )
    )

    scan_data = [
        analysis_row("Scan ID", scan_id),
        analysis_row("File Name", original_name),
        analysis_row("Media Type", media_type.upper()),
        analysis_row("Generated", generated_at),
    ]

    scan_table = Table(
        scan_data,
        colWidths=[
            45 * mm,
            125 * mm
        ],
        repeatRows=0
    )

    scan_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), LIGHT),
            ("BACKGROUND", (1, 0), (1, -1), WHITE),
            ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])
    )

    story.append(scan_table)

    # --------------------------------------------------------
    # IMAGE ANALYSIS
    # --------------------------------------------------------

    image = result.get("image")

    if image:

        story.append(
            Paragraph(
                "Image Analysis",
                section_style
            )
        )

        image_metrics = [
            metric_card(
                "AI IMAGE SCORE",
                safe(image.get("image_score"))
            ),
            metric_card(
                "REAL PROBABILITY",
                f"{safe(image.get('real_probability'))}%",
            ),
            metric_card(
                "FAKE PROBABILITY",
                f"{safe(image.get('fake_probability'))}%",
            ),
        ]

        image_cards = Table(
            [image_metrics],
            colWidths=[
                58 * mm,
                58 * mm,
                58 * mm,
            ]
        )

        image_cards.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ])
        )

        story.append(image_cards)
        story.append(Spacer(1, 8))

        image_data = [
            analysis_row(
                "Resolution",
                image.get("resolution")
            )
        ]

        image_table = Table(
            image_data,
            colWidths=[
                45 * mm,
                125 * mm
            ]
        )

        image_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (0, -1), LIGHT),
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ])
        )

        story.append(image_table)

    # --------------------------------------------------------
    # FORENSIC ANALYSIS
    # --------------------------------------------------------

    ela = result.get("ela")
    noise = result.get("noise")
    metadata = result.get("metadata")

    if ela or noise or metadata:

        story.append(
            Paragraph(
                "Forensic Analysis",
                section_style
            )
        )

        forensic_rows = []

        if ela:
            forensic_rows.append(
                analysis_row(
                    "ELA Score",
                    ela.get("ela_score")
                )
            )

        if noise:
            forensic_rows.append(
                analysis_row(
                    "Noise Score",
                    noise.get("noise_score")
                )
            )

            forensic_rows.append(
                analysis_row(
                    "Noise Variance",
                    noise.get("noise_variance")
                )
            )

        if metadata:
            forensic_rows.append(
                analysis_row(
                    "Metadata Score",
                    metadata.get("metadata_score")
                )
            )

            if metadata.get("file_size") is not None:
                forensic_rows.append(
                    analysis_row(
                        "File Size",
                        f"{metadata.get('file_size')} bytes"
                    )
                )

        forensic_table = Table(
            forensic_rows,
            colWidths=[
                75 * mm,
                95 * mm
            ]
        )

        forensic_table.setStyle(
            TableStyle([
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [
                    WHITE,
                    LIGHT
                ]),
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ])
        )

        story.append(forensic_table)

    # --------------------------------------------------------
    # VIDEO ANALYSIS
    # --------------------------------------------------------

    video = result.get("video")

    if video:

        story.append(
            Paragraph(
                "Video Analysis",
                section_style
            )
        )

        video_rows = [
            analysis_row(
                "Face Score",
                video.get("face_score")
            ),
            analysis_row(
                "Fake Probability",
                video.get("fake_probability")
            ),
        ]

        video_table = Table(
            video_rows,
            colWidths=[
                75 * mm,
                95 * mm
            ]
        )

        video_table.setStyle(
            TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [
                    WHITE,
                    LIGHT
                ]),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ])
        )

        story.append(video_table)

    # --------------------------------------------------------
    # AUDIO ANALYSIS
    # --------------------------------------------------------

    audio = result.get("audio")

    if audio:

        story.append(
            Paragraph(
                "Audio Analysis",
                section_style
            )
        )

        audio_rows = [
            analysis_row(
                "Voice Score",
                audio.get("voice_score")
            ),
            analysis_row(
                "MFCC",
                audio.get("mfcc")
            ),
            analysis_row(
                "RMS",
                audio.get("rms")
            ),
            analysis_row(
                "Zero Crossing Rate",
                audio.get("zcr")
            ),
            analysis_row(
                "Spectral Centroid",
                audio.get("spectral")
            ),
        ]

        audio_table = Table(
            audio_rows,
            colWidths=[
                75 * mm,
                95 * mm
            ]
        )

        audio_table.setStyle(
            TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [
                    WHITE,
                    LIGHT
                ]),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ])
        )

        story.append(audio_table)

    # --------------------------------------------------------
    # LIPSYNC
    # --------------------------------------------------------

    lipsync = result.get("lipsync")

    if lipsync:

        story.append(
            Paragraph(
                "Lip-Sync Analysis",
                section_style
            )
        )

        lip_table = Table(
            [
                analysis_row(
                    "Lip-Sync Score",
                    lipsync.get("lipsync_score")
                ),
                analysis_row(
                    "Details",
                    lipsync.get("details")
                ),
            ],
            colWidths=[
                75 * mm,
                95 * mm
            ]
        )

        lip_table.setStyle(
            TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [
                    WHITE,
                    LIGHT
                ]),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ])
        )

        story.append(lip_table)

    # --------------------------------------------------------
    # DISCLAIMER
    # --------------------------------------------------------

    story.append(Spacer(1, 15))

    disclaimer = Table(
        [[
            Paragraph(
                "<b>Important:</b> DeepVerify AI provides an automated "
                "analysis based on available forensic and AI signals. "
                "Results should be treated as an assessment rather than "
                "absolute proof of authenticity or manipulation.",
                ParagraphStyle(
                    "Disclaimer",
                    fontName="Helvetica",
                    fontSize=8,
                    leading=12,
                    textColor=SLATE,
                )
            )
        ]],
        colWidths=[170 * mm]
    )

    disclaimer.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
            ("BOX", (0, 0), (-1, -1), 0.7, BORDER),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 9),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ])
    )

    story.append(disclaimer)

    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Generated by DeepVerify AI",
            ParagraphStyle(
                "Generated",
                fontName="Helvetica-Bold",
                fontSize=8,
                textColor=BLUE,
                alignment=TA_CENTER,
            )
        )
    )

    # ========================================================
    # BUILD
    # ========================================================

    doc.build(
        story,
        onFirstPage=draw_header_footer,
        onLaterPages=draw_header_footer,
    )

    return filepath