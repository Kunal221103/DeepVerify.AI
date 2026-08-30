# DeepVerify AI

DeepVerify AI is a full-stack media-authenticity analysis platform for examining images, audio, and video for signs of synthetic generation or manipulation. It combines independent visual models, audio anti-spoofing signals, temporal aggregation, metadata checks, lip-motion analysis, scan history, and downloadable PDF reports.

> **Important:** DeepVerify provides probabilistic forensic evidence, not proof of authenticity or manipulation. Treat every result as a decision-support signal and retain human review for consequential use cases.

## Capabilities

- Analyze **images** (`.jpg`, `.jpeg`, `.png`, `.webp`) using multiple image-classification models and forensic indicators.
- Analyze **audio** (`.wav`, `.mp3`, `.m4a`) with segment-based synthetic-voice detection, signal-quality checks, and a second optional anti-spoofing opinion.
- Analyze **video** (`.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`) by extracting frames and audio, then combining visual and audio evidence.
- Assess temporal consistency across sampled video frames instead of relying on a single frame.
- Record scan history in MongoDB and generate a PDF report per completed scan.
- Surface separate model and modality evidence to support review and troubleshooting.

## Architecture

```text
React + Vite client
        |
        v
FastAPI API  --> MongoDB (scan history)
        |
        +-- Image analysis: visual models + ELA/noise/metadata evidence
        +-- Audio analysis: primary anti-spoofing + optional second opinion
        +-- Video analysis: frame sampling + visual ensemble + extracted audio
        +-- PDF report generation
```

## Repository layout

```text
DeepVerify-AI/
+-- backend/
|   +-- ai/                 # Model loaders, inference, and forensic helpers
|   +-- api/                # FastAPI routes
|   +-- models/             # Media-specific detector orchestration
|   +-- services/           # Analysis, history, report, and media workflows
|   +-- utils/              # Frame and audio extraction helpers
|   +-- requirements.txt
|   +-- app.py
+-- frontend/
|   +-- src/                # React application
|   +-- package.json
+-- README.md
```

## Prerequisites

- Python 3.10 or newer
- Node.js 20 or newer
- MongoDB 6 or newer, running locally or reachable through a connection URI
- [FFmpeg](https://ffmpeg.org/) installed and available on `PATH` for video audio extraction
- Internet access on first use so Hugging Face models can be downloaded and cached

GPU acceleration is optional. The detectors use CUDA automatically when PyTorch detects a compatible GPU; CPU execution is supported but can be substantially slower.

## Quick start

### 1. Configure MongoDB

Set these values in `backend/.env` if your MongoDB deployment is not local:

```dotenv
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=deepverify_ai
```

### 2. Start the API

Run these commands from the repository root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd backend
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Verify the service at `http://127.0.0.1:8000/health`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Start the web client

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The development client calls `http://127.0.0.1:8000/api` by default. Start the API before uploading media.

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Service status message |
| `GET` | `/health` | Health response |
| `POST` | `/api/scan` | Upload and analyze one supported media file |
| `GET` | `/api/history` | Retrieve stored scan history |
| `GET` | `/api/report/{scan_id}` | Open the PDF report for a scan |

### Scan a file

```bash
curl -X POST http://127.0.0.1:8000/api/scan \
  -F "file=@/absolute/path/to/media.mp4"
```

The response includes a top-level verdict and confidence along with modality-specific evidence. Scores are percentages, where `fake_probability` represents model-estimated synthetic/manipulated evidence and `real_probability` is its complement after aggregation.

## How results are produced

### Video

The service samples up to 20 frames, evaluates each frame using the visual ensemble, and combines mean and median frame evidence. It separately extracts the audio track and blends audio evidence with visual evidence. Visual evidence receives greater weight because audio classifiers are more sensitive to noise, codecs, music, and background speech.

### Audio and voice

Audio is resampled to 16 kHz mono and assessed in overlapping five-second segments. The analysis includes a primary deepfake-audio classifier, an optional independent anti-spoofing model, signal activity and estimated signal-to-noise checks, plus segment-level scores and reliability information.

Low-quality audio or large disagreement between models reduces reliability rather than turning uncertainty into a strong synthetic-voice claim.

### Image

Image analysis combines multiple classifiers where available with metadata, Error Level Analysis (ELA), and noise-related indicators. These are forensic signals, not independently conclusive findings.

## Evaluation and calibration

Use the audio benchmark command with a labeled manifest before changing thresholds or ensemble weights:

```powershell
cd backend
..\venv\Scripts\python.exe evaluate_audio.py `
  --manifest data\audio_eval\manifest.csv `
  --output audio-evaluation.json
```

Copy and populate `backend/data/audio_eval/manifest.example.csv`. The generated report includes ROC-AUC, average precision, precision, recall, F1, false-positive and false-negative rates, and a threshold recommendation. Keep evaluation clips separate from any clips used to tune configuration.

## Operational guidance

- The first scan may take longer while model weights are downloaded and initialized.
- Video duration, resolution, frame rate, and available hardware all affect analysis time.
- Do not expose the development server directly to the public internet.
- Uploads, temporary files, reports, and model caches may contain sensitive material. Apply retention and access-control policies appropriate to your environment.
- Use a reverse proxy, authenticated access, restrictive CORS settings, rate limits, structured logging, and isolated storage before a production deployment.

## Limitations

- Detection models can produce false positives and false negatives, especially on unseen generators, heavy compression, poor lighting, low bitrate media, multilingual speech, music, overlapping speakers, and post-processed clips.
- A real background voice, edited audio, and an AI-generated voice are distinct forensic questions. Current results should not be interpreted as source attribution or proof that a particular person spoke.
- Model weights and thresholds require validation on representative, labeled data before use in any high-impact workflow.

## Development checks

```powershell
# Backend syntax check
.\venv\Scripts\python.exe -m py_compile backend\app.py

# Frontend lint and production build
cd frontend
npm run lint
npm run build
```

## Security and responsible use

Only analyze media you are authorized to process. Avoid using the system as the sole basis for moderation, legal, employment, financial, or identity decisions. Preserve source files, document the analysis environment, and use independent human review when the outcome matters.

## License

No license file is currently included. Add an explicit license before distributing, reusing, or accepting external contributions to this project.
