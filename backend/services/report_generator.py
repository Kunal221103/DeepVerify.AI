import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.units import mm

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


# ============================================================
# REPORT DIRECTORY
# ============================================================

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


def percentage(value):
    if value is None:
        return "--"

    try:
        return f"{float(value):.2f}%"
    except (TypeError, ValueError):
        return str(value)


def verdict_colors(verdict):

    verdict = str(verdict).upper()

    if verdict == "AUTHENTIC":
        return GREEN, GREEN_LIGHT

    if verdict == "DEEPFAKE":
        return RED, RED_LIGHT

    if verdict == "SUSPICIOUS":
        return YELLOW, YELLOW_LIGHT

    return SLATE, LIGHT


def verdict_description(verdict):

    verdict = str(verdict).upper()

    if verdict == "AUTHENTIC":
        return (
            "The analysis indicates a high probability that "
            "the submitted media is authentic."
        )

    if verdict == "SUSPICIOUS":
        return (
            "The analysis detected signals requiring further "
            "verification. The media should not be treated as "
            "confirmed authentic."
        )

    if verdict == "DEEPFAKE":
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

    canvas.setStrokeColor(BLUE)
    canvas.setLineWidth(2)

    canvas.line(
        18 * mm,
        height - 16 * mm,
        width - 18 * mm,
        height - 16 * mm
    )

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
        "DeepVerify AI • Media Authenticity Analysis"
    )

    canvas.drawRightString(
        width - 18 * mm,
        9 * mm,
        f"Page {doc.page}"
    )

    canvas.restoreState()


# ============================================================
# SECTION TITLE
# ============================================================

def section_title(text):

    return Paragraph(
        text,
        ParagraphStyle(
            "SectionTitle",
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=NAVY,
            spaceBefore=12,
            spaceAfter=8
        )
    )


# ============================================================
# INFO ROW
# ============================================================

def info_row(label, value):

    return [
        Paragraph(
            label,
            ParagraphStyle(
                "InfoLabel",
                fontName="Helvetica",
                fontSize=9,
                textColor=SLATE
            )
        ),

        Paragraph(
            safe(value),
            ParagraphStyle(
                "InfoValue",
                fontName="Helvetica-Bold",
                fontSize=9,
                textColor=DARK
            )
        )
    ]


# ============================================================
# STANDARD TABLE
# ============================================================

def make_table(rows, widths):

    table = Table(
        rows,
        colWidths=widths
    )

    table.setStyle(
        TableStyle([

            ("GRID", (0, 0), (-1, -1), 0.5, BORDER),

            (
                "ROWBACKGROUNDS",
                (0, 0),
                (-1, -1),
                [WHITE, LIGHT]
            ),

            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),

            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])
    )

    return table


# ============================================================
# MODEL VALUE EXTRACTION
# ============================================================

def extract_model_values(model_data):

    real = None
    fake = None
    prediction = None

    if isinstance(model_data, dict):

        real = model_data.get("real_probability")
        fake = model_data.get("fake_probability")
        prediction = model_data.get("predicted_label")

        raw = model_data.get("raw_predictions")

        if isinstance(raw, list):
            model_data = raw

    if isinstance(model_data, list):

        for item in model_data:

            if not isinstance(item, dict):
                continue

            label = str(
                item.get("label", "")
            ).lower()

            confidence = item.get("confidence")

            if confidence is None:
                continue

            if any(
                word in label
                for word in ["human", "real"]
            ):
                real = confidence

            elif any(
                word in label
                for word in [
                    "fake",
                    "artificial",
                    "ai",
                    "generated"
                ]
            ):
                fake = confidence

    return prediction, real, fake


# ============================================================
# MODEL CARD
# ============================================================

def model_card(model_name, model_data):

    prediction, real, fake = extract_model_values(
        model_data
    )

    rows = [

        [
            Paragraph(
                model_name,
                ParagraphStyle(
                    "ModelTitle",
                    fontName="Helvetica-Bold",
                    fontSize=10,
                    textColor=NAVY
                )
            ),

            Paragraph(
                safe(prediction, "Analysis"),
                ParagraphStyle(
                    "ModelPrediction",
                    fontName="Helvetica-Bold",
                    fontSize=9,
                    textColor=BLUE,
                    alignment=TA_RIGHT
                )
            )
        ],

        [
            Paragraph(
                "REAL",
                ParagraphStyle(
                    "RealLabel",
                    fontSize=8,
                    textColor=SLATE
                )
            ),

            Paragraph(
                percentage(real),
                ParagraphStyle(
                    "RealValue",
                    fontName="Helvetica-Bold",
                    fontSize=11,
                    textColor=GREEN,
                    alignment=TA_RIGHT
                )
            )
        ],

        [
            Paragraph(
                "FAKE / AI",
                ParagraphStyle(
                    "FakeLabel",
                    fontSize=8,
                    textColor=SLATE
                )
            ),

            Paragraph(
                percentage(fake),
                ParagraphStyle(
                    "FakeValue",
                    fontName="Helvetica-Bold",
                    fontSize=11,
                    textColor=RED,
                    alignment=TA_RIGHT
                )
            )
        ]
    ]

    table = Table(
        rows,
        colWidths=[
            42 * mm,
            38 * mm
        ]
    )

    table.setStyle(
        TableStyle([

            ("BACKGROUND", (0, 0), (-1, -1), LIGHT),

            ("BOX", (0, 0), (-1, -1), 0.7, BORDER),

            ("LINEBELOW", (0, 0), (-1, 0), 0.5, BORDER),

            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),

            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])
    )

    return table


# ============================================================
# MAIN REPORT GENERATOR
# ============================================================

def generate_report(
    scan_id,
    original_name,
    media_type,
    result
):

    filepath = os.path.join(
        REPORT_DIR,
        f"{scan_id}.pdf"
    )

    score = get_score(result)

    verdict = result.get(
        "verdict",
        "UNKNOWN"
    )

    real_probability = result.get(
        "real_probability"
    )

    fake_probability = result.get(
        "fake_probability"
    )

    generated_at = datetime.now().strftime(
        "%d %B %Y • %I:%M %p"
    )

    verdict_color, verdict_background = verdict_colors(
        verdict
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

        author="DeepVerify AI"
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=29,
        textColor=NAVY,
        alignment=TA_LEFT,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=LIGHT_SLATE,
        spaceAfter=14
    )

    normal_style = ParagraphStyle(
        "NormalReport",
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=SLATE
    )

    story = []

    # ========================================================
    # BRAND
    # ========================================================

    brand = Table(
        [[

            Paragraph(
                "<b>DEEPVERIFY</b> "
                "<font color='#2563EB'>AI</font>",
                ParagraphStyle(
                    "Brand",
                    fontName="Helvetica-Bold",
                    fontSize=13,
                    textColor=NAVY
                )
            ),

            Paragraph(
                "MEDIA AUTHENTICITY REPORT",
                ParagraphStyle(
                    "BrandRight",
                    fontName="Helvetica-Bold",
                    fontSize=7,
                    textColor=BLUE,
                    alignment=TA_RIGHT
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
            ("RIGHTPADDING", (0, 0), (-1, -1), 0)
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
            "AI-powered multi-model media authenticity analysis",
            subtitle_style
        )
    )

    # ========================================================
    # FINAL VERDICT
    # ========================================================

    verdict_table = Table(
        [[

            Paragraph(
                "<font size='8'>FINAL VERDICT</font><br/>"
                f"<font size='22'><b>{verdict}</b></font>",
                ParagraphStyle(
                    "VerdictHero",
                    fontName="Helvetica",
                    textColor=verdict_color,
                    leading=22
                )
            ),

            Paragraph(
                "<font size='8'>FINAL ANALYSIS SCORE</font><br/>"
                f"<font size='25'><b>{score:.2f}%</b></font>",
                ParagraphStyle(
                    "ScoreHero",
                    fontName="Helvetica",
                    textColor=NAVY,
                    alignment=TA_RIGHT,
                    leading=24
                )
            )

        ]],
        colWidths=[
            85 * mm,
            85 * mm
        ]
    )

    verdict_table.setStyle(
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
                12
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                12
            )
        ])
    )

    story.append(verdict_table)
    story.append(Spacer(1, 8))

    story.append(
        Paragraph(
            verdict_description(verdict),
            normal_style
        )
    )

    # ========================================================
    # PROBABILITY
    # ========================================================

    if (
        real_probability is not None
        or fake_probability is not None
    ):

        story.append(
            section_title(
                "Probability Assessment"
            )
        )

        probability_table = Table(
            [[

                Paragraph(
                    "<font size='8'>REAL PROBABILITY</font><br/>"
                    f"<font size='18'><b>"
                    f"{percentage(real_probability)}"
                    f"</b></font>",
                    ParagraphStyle(
                        "RealProbability",
                        textColor=GREEN,
                        leading=20
                    )
                ),

                Paragraph(
                    "<font size='8'>FAKE PROBABILITY</font><br/>"
                    f"<font size='18'><b>"
                    f"{percentage(fake_probability)}"
                    f"</b></font>",
                    ParagraphStyle(
                        "FakeProbability",
                        textColor=RED,
                        alignment=TA_RIGHT,
                        leading=20
                    )
                )

            ]],
            colWidths=[
                85 * mm,
                85 * mm
            ]
        )

        probability_table.setStyle(
            TableStyle([

                (
                    "BACKGROUND",
                    (0, 0),
                    (0, 0),
                    GREEN_LIGHT
                ),

                (
                    "BACKGROUND",
                    (1, 0),
                    (1, 0),
                    RED_LIGHT
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
                    12
                ),

                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    12
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
                )
            ])
        )

        story.append(probability_table)

    # ========================================================
    # SCAN INFORMATION
    # ========================================================

    story.append(
        section_title(
            "Scan Information"
        )
    )

    story.append(
        make_table(
            [
                info_row("Scan ID", scan_id),
                info_row("File Name", original_name),
                info_row(
                    "Media Type",
                    str(media_type).upper()
                ),
                info_row(
                    "Generated",
                    generated_at
                )
            ],
            [
                45 * mm,
                125 * mm
            ]
        )
    )

    # ========================================================
    # IMAGE MODEL EVIDENCE
    # ========================================================

    models = result.get("models", {})

    image_data = result.get(
        "image",
        {}
    )

    model_evidence = image_data.get(
        "model_evidence",
        {}
    )

    if not models:
        models = model_evidence

    if models:

        story.append(
            section_title(
                "AI Model Evidence"
            )
        )

        model1 = (
            models.get("model_1")
            if isinstance(models, dict)
            else None
        )

        model2 = (
            models.get("model_2")
            if isinstance(models, dict)
            else None
        )

        model3 = (
            models.get("model_3")
            if isinstance(models, dict)
            else None
        )

        model_table = Table(
            [[

                model_card(
                    "MODEL 1",
                    model1
                ),

                model_card(
                    "MODEL 2",
                    model2
                ),

                model_card(
                    "MODEL 3 • SDXL",
                    model3
                )

            ]],
            colWidths=[
                56 * mm,
                56 * mm,
                56 * mm
            ]
        )

        model_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4)
            ])
        )

        story.append(model_table)

    # ========================================================
    # IMAGE ANALYSIS
    # ========================================================

    if image_data:

        story.append(
            section_title(
                "Image Analysis"
            )
        )

        story.append(
            make_table(
                [
                    info_row(
                        "Prediction",
                        image_data.get("prediction")
                    ),

                    info_row(
                        "Confidence",
                        percentage(
                            image_data.get("confidence")
                        )
                    ),

                    info_row(
                        "Real Probability",
                        percentage(
                            image_data.get(
                                "real_probability"
                            )
                        )
                    ),

                    info_row(
                        "Fake Probability",
                        percentage(
                            image_data.get(
                                "fake_probability"
                            )
                        )
                    )
                ],
                [
                    60 * mm,
                    110 * mm
                ]
            )
        )

    # ========================================================
    # METADATA
    # ========================================================

    metadata = result.get("metadata")

    if metadata:

        story.append(
            section_title(
                "Metadata Analysis"
            )
        )

        metadata_rows = [

            info_row(
                "Metadata Score",
                metadata.get(
                    "metadata_score"
                )
            ),

            info_row(
                "File Size",
                (
                    f"{metadata.get('file_size')} bytes"
                    if metadata.get("file_size") is not None
                    else "--"
                )
            ),

            info_row(
                "Format",
                metadata.get("format")
            ),

            info_row(
                "Width",
                metadata.get("width")
            ),

            info_row(
                "Height",
                metadata.get("height")
            ),

            info_row(
                "EXIF Present",
                (
                    "Yes"
                    if metadata.get("exif_present")
                    else "No"
                )
            ),

            info_row(
                "EXIF Fields",
                metadata.get("exif_fields")
            ),
        ]

        if metadata.get("sha256"):

            metadata_rows.append(
                info_row(
                    "SHA-256",
                    metadata.get("sha256")
                )
            )

        story.append(
            make_table(
                metadata_rows,
                [
                    55 * mm,
                    115 * mm
                ]
            )
        )

    # ========================================================
    # IMAGE FORENSICS
    # ========================================================

    ela = result.get("ela")
    noise = result.get("noise")

    if ela or noise:

        story.append(
            section_title(
                "Forensic Analysis"
            )
        )

        forensic_rows = []

        if ela:

            forensic_rows.append(
                info_row(
                    "ELA Score",
                    ela.get("ela_score")
                )
            )

        if noise:

            forensic_rows.append(
                info_row(
                    "Noise Score",
                    noise.get("noise_score")
                )
            )

            forensic_rows.append(
                info_row(
                    "Noise Variance",
                    noise.get("noise_variance")
                )
            )

        if forensic_rows:

            story.append(
                make_table(
                    forensic_rows,
                    [
                        75 * mm,
                        95 * mm
                    ]
                )
            )

    # ========================================================
    # VIDEO ANALYSIS
    # ========================================================

    video = result.get("video")

    if video:

        story.append(
            section_title(
                "Video Analysis"
            )
        )

        video_rows = [

            info_row(
                "Face / Authenticity Score",
                percentage(
                    video.get("face_score")
                )
            ),

            info_row(
                "Fake Probability",
                percentage(
                    video.get("fake_probability")
                )
            ),

            info_row(
                "Frames Analyzed",
                video.get("frames_analyzed")
            ),

            info_row(
                "Detection Model",
                video.get("model")
            )
        ]

        story.append(
            make_table(
                video_rows,
                [
                    75 * mm,
                    95 * mm
                ]
            )
        )

    # ========================================================
    # AUDIO ANALYSIS
    # ========================================================

    audio = result.get("audio")

    if audio:

        story.append(
            section_title(
                "Audio Analysis"
            )
        )

        audio_rows = [

            info_row(
                "Voice Score",
                percentage(
                    audio.get("voice_score")
                )
            ),

            info_row(
                "Real Probability",
                percentage(
                    audio.get("real_probability")
                )
            ),

            info_row(
                "Fake Probability",
                percentage(
                    audio.get("fake_probability")
                )
            ),

            info_row(
                "Duration",
                (
                    f"{audio.get('duration'):.2f} sec"
                    if isinstance(
                        audio.get("duration"),
                        (int, float)
                    )
                    else audio.get("duration")
                )
            ),

            info_row(
                "Detection Model",
                audio.get("model")
            )
        ]

        # Include MFCC/RMS/ZCR only when your detector
        # actually returns them.

        if audio.get("mfcc") is not None:

            audio_rows.append(
                info_row(
                    "MFCC",
                    audio.get("mfcc")
                )
            )

        if audio.get("rms") is not None:

            audio_rows.append(
                info_row(
                    "RMS",
                    audio.get("rms")
                )
            )

        if audio.get("zcr") is not None:

            audio_rows.append(
                info_row(
                    "Zero Crossing Rate",
                    audio.get("zcr")
                )
            )

        story.append(
            make_table(
                audio_rows,
                [
                    75 * mm,
                    95 * mm
                ]
            )
        )

    # ========================================================
    # LIP-SYNC ANALYSIS
    # ========================================================

    lipsync = result.get("lipsync")

    if lipsync:

        story.append(
            section_title(
                "Lip-Sync Analysis"
            )
        )

        lipsync_rows = [

            info_row(
                "Lip-Sync Score",
                percentage(
                    lipsync.get(
                        "lipsync_score"
                    )
                )
            ),

            info_row(
                "Frames Analyzed",
                lipsync.get(
                    "frames_analyzed"
                )
            ),

            info_row(
                "Mouth Motion",
                lipsync.get(
                    "mouth_motion"
                )
            ),

            info_row(
                "Details",
                lipsync.get(
                    "details"
                )
            )
        ]

        story.append(
            make_table(
                lipsync_rows,
                [
                    75 * mm,
                    95 * mm
                ]
            )
        )

    # ========================================================
    # DISCLAIMER
    # ========================================================

    story.append(
        Spacer(1, 15)
    )

    disclaimer = Table(
        [[

            Paragraph(
                "<b>Important:</b> DeepVerify AI provides "
                "automated analysis based on AI models and "
                "forensic signals. Results should be treated "
                "as an assessment rather than absolute proof "
                "of authenticity or manipulation.",
                ParagraphStyle(
                    "Disclaimer",
                    fontName="Helvetica",
                    fontSize=8,
                    leading=12,
                    textColor=SLATE
                )
            )

        ]],
        colWidths=[
            170 * mm
        ]
    )

    disclaimer.setStyle(
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

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                9
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                9
            )
        ])
    )

    story.append(disclaimer)

    story.append(Spacer(1, 10))

    story.append(
        Paragraph(
            "Generated by DeepVerify AI",
            ParagraphStyle(
                "Generated",
                fontName="Helvetica-Bold",
                fontSize=8,
                textColor=BLUE,
                alignment=TA_CENTER
            )
        )
    )

    # ========================================================
    # BUILD
    # ========================================================

    doc.build(
        story,
        onFirstPage=draw_header_footer,
        onLaterPages=draw_header_footer
    )

    return filepath