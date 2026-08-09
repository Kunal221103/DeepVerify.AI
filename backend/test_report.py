from services.report_generator import generate_report


result = {
    "score": 76.19,

    "verdict": "SUSPICIOUS",

    "image": {
        "image_score": 72.87,
        "real_probability": 72.87,
        "fake_probability": 27.13,
        "resolution": "720x1280"
    },

    "metadata": {
        "metadata_score": 95
    },

    "ela": {
        "ela_score": 70
    },

    "noise": {
        "noise_score": 60
    }
}


path = generate_report(
    scan_id="test-report-001",
    original_name="test.jpg",
    media_type="image",
    result=result
)


print("PDF generated:")
print(path)