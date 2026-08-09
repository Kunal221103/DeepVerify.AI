from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.scan import router as scan_router
from api.history import router as history_router
from api.report import router as report_router


app = FastAPI(
    title="DeepVerify AI",
    description="Deepfake Video, Audio & Image Detection API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(scan_router)

app.include_router(history_router)

app.include_router(report_router)

@app.get("/")
def home():

    return {
        "message": "DeepVerify AI Backend Running"
    }


@app.get("/health")
def health():

    return {
        "status": "Healthy"
    }