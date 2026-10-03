import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
    AlertTriangle,
    AudioLines,
    CheckCircle2,
    ChevronDown,
    CircleHelp,
    Download,
    FileAudio,
    FileImage,
    FileSearch,
    FileText,
    FileVideo,
    Fingerprint,
    History as HistoryIcon,
    Info,
    Layers3,
    ScanLine,
    ShieldAlert,
    ShieldCheck,
    Upload,
    Video,
    Volume2,
    Waves,
} from "lucide-react";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";


// ============================================================
// RESULT PAGE
// ============================================================

export default function Result() {

    const location = useLocation();
    const navigate = useNavigate();
    const { scanId } = useParams();

    const [scan, setScan] = useState(
        location.state || null
    );

    const [loading, setLoading] = useState(
        !location.state && !!scanId
    );


    // ==========================================================
    // LOAD RESULT
    // ==========================================================

    useEffect(() => {

        if (location.state) {

            setScan(location.state);
            setLoading(false);

            return;
        }


        if (!scanId) {

            setLoading(false);

            return;
        }


        async function loadScan() {

            try {

                const history = await getHistory();

                const found = history.find(
                    (item) =>
                        item.scan_id === scanId ||
                        item._id === scanId
                );

                setScan(
                    found || null
                );

            } catch (error) {

                console.error(
                    "Failed to load scan:",
                    error
                );

                setScan(null);

            } finally {

                setLoading(false);

            }
        }


        loadScan();

    }, [location.state, scanId]);


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <Layout>

                <div className="flex min-h-[70vh] items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">

                            <ScanLine
                                size={28}
                                className="animate-pulse text-blue-400"
                            />

                        </div>


                        <h2 className="mt-6 text-2xl font-bold">
                            Loading analysis
                        </h2>


                        <p className="mt-2 text-sm text-slate-500">
                            Retrieving forensic results...
                        </p>

                    </div>

                </div>

            </Layout>
        );
    }


    // ==========================================================
    // NOT FOUND
    // ==========================================================

    if (!scan) {

        return (

            <Layout>

                <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center">

                    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-10">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950">

                            <CircleHelp
                                size={32}
                                className="text-slate-500"
                            />

                        </div>


                        <h1 className="mt-6 text-3xl font-bold">
                            Scan Not Found
                        </h1>


                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            The requested analysis could not be retrieved.
                        </p>


                        <div className="mt-7 flex flex-wrap justify-center gap-3">

                            <button
                                onClick={() =>
                                    navigate("/history")
                                }
                                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold transition hover:bg-slate-700"
                            >
                                History
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/upload")
                                }
                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                            >
                                New Scan
                            </button>

                        </div>

                    </div>

                </div>

            </Layout>
        );
    }


    // ==========================================================
    // NORMALIZE RESULT
    // ==========================================================

    const result =
        scan.result &&
        typeof scan.result === "object"

            ? {

                ...scan.result,

                scan_id:
                    scan.scan_id ||
                    scan.result.scan_id ||
                    scan._id,

                media:
                    scan.media ||
                    scan.result.media ||
                    scan.media_type,

                score:
                    scan.score ??
                    scan.result.score,

                confidence:
                    scan.confidence ??
                    scan.result.confidence ??
                    scan.result.score ??
                    scan.score,

                verdict:
                    scan.verdict ||
                    scan.result.verdict ||
                    "UNKNOWN",

                real_probability:
                    scan.real_probability ??
                    scan.result.real_probability,

                fake_probability:
                    scan.fake_probability ??
                    scan.result.fake_probability,

                original_name:
                    scan.original_name ||
                    scan.result.original_name ||
                    scan.filename ||
                    scan.result.filename,

            }

            : scan;


    // ==========================================================
    // BASIC VALUES
    // ==========================================================

    const verdict =
        normalizeVerdict(
            result.verdict
        );


    const media =
        String(
            result.media ||
            result.media_type ||
            "unknown"
        ).toLowerCase();


    const confidenceNumber =
        Number(
            result.confidence ??
            result.score
        );


    const confidence =
        Number.isFinite(confidenceNumber)
            ? confidenceNumber.toFixed(2)
            : "--";


    const realNumber =
        Number(
            result.real_probability
        );


    const fakeNumber =
        Number(
            result.fake_probability
        );


    const realProbability =
        Number.isFinite(realNumber)
            ? realNumber.toFixed(2)
            : "--";


    const fakeProbability =
        Number.isFinite(fakeNumber)
            ? fakeNumber.toFixed(2)
            : "--";


    const reportId =
        result.scan_id ||
        scan.scan_id ||
        scan._id;


    const filename =
        result.original_name ||
        result.filename ||
        "Submitted media";


    // ==========================================================
    // VERDICT
    // ==========================================================

    const verdictConfig = {

        AUTHENTIC: {

            icon: CheckCircle2,

            title: "AUTHENTIC",

            description:
                "No strong synthetic evidence was detected.",

            color:
                "text-emerald-400",

            border:
                "border-emerald-500/25",

            background:
                "bg-emerald-500/5",

            glow:
                "bg-emerald-500/10",

        },


        DEEPFAKE: {

            icon: ShieldAlert,

            title: "DEEPFAKE",

            description:
                "Strong synthetic or manipulated evidence was detected.",

            color:
                "text-rose-400",

            border:
                "border-rose-500/25",

            background:
                "bg-rose-500/5",

            glow:
                "bg-rose-500/10",

        },


        SUSPICIOUS: {

            icon: AlertTriangle,

            title: "SUSPICIOUS",

            description:
                "The available evidence is mixed and requires further review.",

            color:
                "text-amber-400",

            border:
                "border-amber-500/25",

            background:
                "bg-amber-500/5",

            glow:
                "bg-amber-500/10",

        },


        UNKNOWN: {

            icon: CircleHelp,

            title: "UNKNOWN",

            description:
                "Insufficient evidence was returned for classification.",

            color:
                "text-slate-400",

            border:
                "border-slate-700",

            background:
                "bg-slate-800/30",

            glow:
                "bg-slate-500/10",

        },

    };


    const config =
        verdictConfig[verdict] ||
        verdictConfig.UNKNOWN;


    const VerdictIcon =
        config.icon;


    // ==========================================================
    // DOWNLOAD PDF
    // ==========================================================

    const downloadReport = () => {

        if (!reportId) {

            alert(
                "Report ID is not available."
            );

            return;
        }


        window.open(
            `http://127.0.0.1:8000/api/report/${reportId}`,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // ==========================================================
    // RETURN
    // ==========================================================

    return (

        <Layout>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-7">

                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                    <div className="min-w-0">

                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">

                            <FileSearch
                                size={16}
                            />

                            Forensic Analysis

                        </div>


                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Scan Result
                        </h1>


                        <div className="mt-3 flex max-w-3xl items-center gap-3">

                            <MediaIcon
                                media={media}
                            />

                            <p className="truncate text-sm text-slate-400">

                                Analysis for{" "}

                                <span className="font-medium text-slate-200">
                                    {filename}
                                </span>

                            </p>

                        </div>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={() =>
                                navigate("/history")
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
                        >

                            <HistoryIcon
                                size={17}
                            />

                            History

                        </button>


                        <button
                            onClick={downloadReport}
                            disabled={!reportId}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            <Download
                                size={17}
                            />

                            Download PDF

                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                HERO VERDICT
            ================================================== */}

            <section
                className={`
                    relative overflow-hidden rounded-3xl border
                    ${config.border}
                    ${config.background}
                `}
            >

                <div
                    className={`
                        pointer-events-none absolute -right-24 -top-24
                        h-64 w-64 rounded-full blur-3xl
                        ${config.glow}
                    `}
                />


                <div className="relative grid lg:grid-cols-[1fr_360px]">


                    {/* VERDICT */}

                    <div className="p-7 sm:p-9 lg:p-10">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

                            <div
                                className={`
                                    flex h-16 w-16 shrink-0 items-center
                                    justify-center rounded-2xl border
                                    border-white/5 bg-slate-950/60
                                    ${config.color}
                                `}
                            >

                                <VerdictIcon
                                    size={34}
                                />

                            </div>


                            <div className="min-w-0">

                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                    Final Verdict
                                </p>


                                <h2
                                    className={`
                                        mt-2 text-4xl font-black tracking-tight
                                        sm:text-5xl
                                        ${config.color}
                                    `}
                                >
                                    {config.title}
                                </h2>


                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                    {config.description}
                                </p>

                            </div>

                        </div>


                        <div className="mt-8 flex flex-wrap gap-2">

                            <StatusPill
                                label="Media"
                                value={media}
                            />

                            <StatusPill
                                label="Analysis"
                                value="Complete"
                            />

                            {reportId && (

                                <StatusPill
                                    label="Report"
                                    value="Available"
                                />

                            )}

                        </div>


                        <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-5">

                            <Info
                                size={17}
                                className="mt-0.5 shrink-0 text-slate-500"
                            />

                            <p className="text-xs leading-5 text-slate-500">

                                AI detection is probabilistic. Interpret the
                                final verdict together with the individual
                                evidence signals below.

                            </p>

                        </div>

                    </div>


                    {/* CONFIDENCE */}

                    <div className="border-t border-white/10 bg-slate-950/30 p-7 sm:p-9 lg:border-l lg:border-t-0">

                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Overall Confidence
                        </p>


                        <div className="mt-4 flex items-end gap-1">

                            <span className="text-6xl font-black tabular-nums tracking-tight">
                                {confidence}
                            </span>

                            <span className="mb-2 text-2xl text-slate-600">
                                %
                            </span>

                        </div>


                        <div className="mt-6">

                            <div className="flex items-center justify-between text-[11px] text-slate-600">

                                <span>
                                    0
                                </span>

                                <span>
                                    100
                                </span>

                            </div>


                            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">

                                <div
                                    className="h-full rounded-full bg-blue-500 transition-all duration-700"
                                    style={{
                                        width: `${clamp(
                                            confidenceNumber
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>


                        <p className="mt-5 text-xs leading-5 text-slate-500">
                            Confidence represents the strength of the available
                            model evidence, not absolute certainty.
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================================
                EVIDENCE OVERVIEW
            ================================================== */}

            <section className="mt-6 grid gap-5 lg:grid-cols-2">

                <EvidenceCard
                    icon={
                        <ShieldCheck
                            size={20}
                        />
                    }
                    title="Authentic Evidence"
                    value={realProbability}
                    description="Evidence consistent with authentic media."
                    type="real"
                />


                <EvidenceCard
                    icon={
                        <ShieldAlert
                            size={20}
                        />
                    }
                    title="Synthetic Evidence"
                    value={fakeProbability}
                    description="Evidence consistent with generated or manipulated media."
                    type="fake"
                />

            </section>


            {/* ==================================================
                QUICK SUMMARY
            ================================================== */}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <QuickMetric
                    icon={
                        <FileText
                            size={18}
                        />
                    }
                    label="Media Type"
                    value={capitalize(media)}
                />


                <QuickMetric
                    icon={
                        <Fingerprint
                            size={18}
                        />
                    }
                    label="Scan ID"
                    value={
                        reportId
                            ? shortenId(reportId)
                            : "--"
                    }
                />


                <QuickMetric
                    icon={
                        <Layers3
                            size={18}
                        />
                    }
                    label="Evidence"
                    value={
                        countEvidence(
                            result
                        )
                    }
                />


                <QuickMetric
                    icon={
                        <ShieldCheck
                            size={18}
                        />
                    }
                    label="Status"
                    value="Analysis Complete"
                />

            </section>


            {/* ==================================================
                SCAN INFORMATION
            ================================================== */}

            <Section
                icon={
                    <FileText
                        size={18}
                    />
                }
                title="Scan Information"
                subtitle="Basic information associated with this analysis."
            >

                <div className="grid gap-4 md:grid-cols-3">

                    <InfoCard
                        label="Media Type"
                        value={capitalize(media)}
                    />

                    <InfoCard
                        label="File"
                        value={filename}
                    />

                    <InfoCard
                        label="Scan ID"
                        value={reportId || "--"}
                    />

                </div>

            </Section>


            {/* ==================================================
                VIDEO
            ================================================== */}

            {result.video && (

                <Section
                    icon={
                        <Video
                            size={18}
                        />
                    }
                    title="Video Analysis"
                    subtitle="Visual evidence extracted from sampled video frames."
                >

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <Metric
                            label="Visual Authenticity"
                            value={percent(
                                result.video.face_score
                            )}
                        />

                        <Metric
                            label="Fake Probability"
                            value={percent(
                                result.video.fake_probability
                            )}
                            danger
                        />

                        <Metric
                            label="Frames Analyzed"
                            value={
                                result.video.frames_analyzed ??
                                "--"
                            }
                        />

                        <Metric
                            label="Fake Frame Ratio"
                            value={percent(
                                result.video.fake_frame_ratio
                            )}
                            danger
                        />

                    </div>


                    {result.video.model_scores && (
    <div className="mt-7 border-t border-slate-800 pt-6">

        <div className="flex items-start justify-between gap-4">

            <div>

                <div className="flex items-center gap-2">

                    <ScanLine
                        size={17}
                        className="text-blue-400"
                    />

                    <h3 className="font-semibold text-slate-200">
                        Visual Model Evidence
                    </h3>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                    Video-specific detection models analyzing
                    sampled frames.
                </p>

            </div>

            <span className="hidden rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 sm:block">
                3 Models
            </span>

        </div>


        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            <VideoModelCard
                number="02"
                title="Model 2"
                value={
                    result.video.model_scores
                        .model_2_fake_probability
                }
            />

            <VideoModelCard
                number="03"
                title="Model 3"
                value={
                    result.video.model_scores
                        .model_3_fake_probability
                }
                primary
            />

            <VideoModelCard
                number="04"
                title="Model 4"
                value={
                    result.video.model_scores
                        .model_4_fake_probability
                }
                note={
                    result.video.model_scores
                        .model_4_outlier_frames > 0
                        ? `${
                            result.video.model_scores
                                .model_4_outlier_frames
                        } outlier frame(s) excluded`
                        : "Consensus-checked"
                }
            />

        </div>

    </div>
)}


                </Section>

            )}


            {/* ==================================================
                VIDEO AGGREGATION
            ================================================== */}

            {result.video?.aggregation && (

                <Section
                    icon={
                        <Layers3
                            size={18}
                        />
                    }
                    title="Video Aggregation"
                    subtitle="Temporal aggregation of frame-level evidence."
                >

                    <div className="grid gap-4 md:grid-cols-2">

                        <Metric
                            label="Mean Fake Probability"
                            value={percent(
                                result.video.aggregation
                                    .mean_fake_probability
                            )}
                            danger
                        />

                        <Metric
                            label="Median Fake Probability"
                            value={percent(
                                result.video.aggregation
                                    .median_fake_probability
                            )}
                            danger
                        />

                    </div>

                </Section>

            )}


            {/* ==================================================
                AUDIO
            ================================================== */}

            {result.audio && (

                <Section
                    icon={
                        <AudioLines
                            size={18}
                        />
                    }
                    title="Audio Analysis"
                    subtitle="Voice authenticity evidence extracted from the media."
                >

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <Metric
                            label="Voice Score"
                            value={percent(
                                result.audio.voice_score
                            )}
                        />

                        <Metric
                            label="Real Probability"
                            value={percent(
                                result.audio.real_probability
                            )}
                        />

                        <Metric
                            label="Fake Probability"
                            value={percent(
                                result.audio.fake_probability
                            )}
                            danger
                        />

                        <Metric
                            label="Duration"
                            value={
                                result.audio.duration !== undefined
                                    ? `${result.audio.duration} sec`
                                    : "--"
                            }
                        />

                    </div>


                    <AudioEvidenceBar
                        real={
                            result.audio.real_probability
                        }
                        fake={
                            result.audio.fake_probability
                        }
                    />


                    {result.audio.segment_predictions?.length > 0 && (

                        <AudioSegments
                            segments={
                                result.audio.segment_predictions
                            }
                        />

                    )}

                </Section>

            )}


            {/* ==================================================
                MULTIMODAL
            ================================================== */}

            {result.media === "video" &&
                result.ensemble && (

                    <Section
                        icon={
                            <Waves
                                size={18}
                            />
                        }
                        title="Multimodal Analysis"
                        subtitle="Combined visual and audio evidence."
                    >

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <Metric
                                label="Visual Fake Evidence"
                                value={percent(
                                    result.ensemble
                                        .visual_fake_probability
                                )}
                                danger
                            />

                            <Metric
                                label="Audio Fake Evidence"
                                value={percent(
                                    result.ensemble
                                        .audio_fake_probability
                                )}
                                danger
                            />

                            <Metric
                                label="Visual Weight"
                                value={
                                    result.ensemble
                                        .visual_weight !== undefined
                                        ? `${Number(
                                            result.ensemble.visual_weight
                                        ) * 100}%`
                                        : "--"
                                }
                            />

                            <Metric
                                label="Audio Weight"
                                value={
                                    result.ensemble
                                        .audio_weight !== undefined
                                        ? `${Number(
                                            result.ensemble.audio_weight
                                        ) * 100}%`
                                        : "--"
                                }
                            />

                        </div>

                    </Section>

                )}


            {/* ==================================================
                LIP SYNC
            ================================================== */}

            {result.lipsync && (

                <Section
                    icon={
                        <Volume2
                            size={18}
                        />
                    }
                    title="Lip-Sync Analysis"
                    subtitle="Analysis of mouth movement consistency within the video."
                >

                    <div className="grid gap-4 md:grid-cols-3">

                        <Metric
                            label="Lip-Sync Score"
                            value={percent(
                                result.lipsync.lipsync_score
                            )}
                        />

                        <Metric
                            label="Frames Analyzed"
                            value={
                                result.lipsync.frames_analyzed ??
                                "--"
                            }
                        />

                        <Metric
                            label="Mouth Motion"
                            value={
                                result.lipsync.mouth_motion ??
                                "--"
                            }
                        />

                    </div>


                    {result.lipsync.details && (

                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                            <Info
                                size={17}
                                className="mt-0.5 shrink-0 text-slate-600"
                            />

                            <p className="text-sm leading-6 text-slate-500">
                                {result.lipsync.details}
                            </p>

                        </div>

                    )}

                </Section>

            )}


            {/* ==================================================
                METADATA
            ================================================== */}

            {result.metadata && (

                <Section
                    icon={
                        <Fingerprint
                            size={18}
                        />
                    }
                    title="Metadata Analysis"
                    subtitle="File-level metadata and integrity information."
                >

                    <div className="grid gap-4 md:grid-cols-2">

                        <Metric
                            label="Metadata Score"
                            value={
                                result.metadata.metadata_score ??
                                "--"
                            }
                        />

                        <Metric
                            label="File Size"
                            value={
                                result.metadata.file_size !== undefined
                                    ? formatBytes(
                                        result.metadata.file_size
                                    )
                                    : "--"
                            }
                        />

                        <InfoCard
                            label="SHA-256"
                            value={
                                result.metadata.sha256 ||
                                "--"
                            }
                        />

                        <InfoCard
                            label="EXIF"
                            value={
                                result.metadata.exif_present
                                    ? `${result.metadata.exif_fields || 0} fields`
                                    : "Not present"
                            }
                        />

                    </div>

                </Section>

            )}


            {/* ==================================================
                IMAGE MODELS
            ================================================== */}

            {result.media === "image" &&
                result.models && (

                    <Section
                        icon={
                            <FileImage
                                size={18}
                            />
                        }
                        title="AI Model Evidence"
                        subtitle="Results from the image detection models."
                    >

                        <div className="grid gap-4 md:grid-cols-3">

                            {Object.entries(
                                result.models
                            ).map(
                                ([name, data]) => (

                                    <ModelCard
                                        key={name}
                                        title={formatLabel(name)}
                                        data={data}
                                    />

                                )
                            )}

                        </div>

                    </Section>

                )}


            {/* ==================================================
                FINAL ACTIONS
            ================================================== */}

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h2 className="font-semibold">
                            Analysis complete
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Review the evidence or start another scan.
                        </p>

                    </div>


                    <div className="flex flex-wrap gap-3">

                        <button
                            onClick={() =>
                                navigate("/upload")
                            }
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                        >

                            <Upload
                                size={17}
                            />

                            New Scan

                        </button>


                        <button
                            onClick={() =>
                                navigate("/history")
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                        >

                            <HistoryIcon
                                size={17}
                            />

                            History

                        </button>


                        <button
                            onClick={downloadReport}
                            disabled={!reportId}
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-blue-500/30 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            <Download
                                size={17}
                            />

                            Download PDF

                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                RAW DATA
            ================================================== */}

            <details className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

                <summary className="flex cursor-pointer items-center gap-3 px-6 py-5 text-sm font-medium text-slate-400 transition hover:text-slate-200">

                    <FileSearch
                        size={17}
                    />

                    View raw analysis data

                    <ChevronDown
                        size={16}
                        className="ml-auto"
                    />

                </summary>


                <pre className="max-h-[600px] overflow-auto border-t border-slate-800 bg-slate-950 p-5 text-xs leading-6 text-slate-500">
                    {JSON.stringify(
                        result,
                        null,
                        2
                    )}
                </pre>

            </details>

        </Layout>
    );
}


// ============================================================
// SECTION
// ============================================================

function Section({
    icon,
    title,
    subtitle,
    children
}) {

    return (

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">

            <div className="mb-6">

                <div className="flex items-center gap-2">

                    <span className="text-blue-400">
                        {icon}
                    </span>

                    <h2 className="text-xl font-semibold">
                        {title}
                    </h2>

                </div>


                {subtitle && (

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        {subtitle}
                    </p>

                )}

            </div>


            {children}

        </section>
    );
}


// ============================================================
// EVIDENCE CARD
// ============================================================

function EvidenceCard({
    icon,
    title,
    value,
    description,
    type
}) {

    const numeric =
        Number(value);


    const safe =
        Number.isFinite(numeric)
            ? clamp(numeric)
            : 0;


    const real =
        type === "real";


    return (

        <div
            className={`
                rounded-3xl border p-6
                ${
                    real
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-rose-500/20 bg-rose-500/5"
                }
            `}
        >

            <div className="flex items-start justify-between gap-5">

                <div className="flex items-start gap-3">

                    <div
                        className={`
                            rounded-xl p-2.5
                            ${
                                real
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-rose-500/10 text-rose-400"
                            }
                        `}
                    >
                        {icon}
                    </div>


                    <div>

                        <p className="font-semibold text-slate-200">
                            {title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {description}
                        </p>

                    </div>

                </div>


                <p
                    className={`
                        text-3xl font-black tabular-nums
                        ${
                            real
                                ? "text-emerald-300"
                                : "text-rose-300"
                        }
                    `}
                >
                    {value}%
                </p>

            </div>


            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">

                <div
                    className={
                        `h-full rounded-full ${
                            real
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                        }`
                    }
                    style={{
                        width: `${safe}%`
                    }}
                />

            </div>

        </div>
    );
}


// ============================================================
// AUDIO EVIDENCE BAR
// ============================================================

function AudioEvidenceBar({
    real,
    fake
}) {

    const realValue =
        Number(real);


    const fakeValue =
        Number(fake);


    if (
        !Number.isFinite(realValue) ||
        !Number.isFinite(fakeValue)
    ) {
        return null;
    }


    return (

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                    <FileAudio
                        size={17}
                        className="text-blue-400"
                    />

                    <span className="text-sm font-medium text-slate-300">
                        Voice Evidence Balance
                    </span>

                </div>


                <span className="text-xs text-slate-600">
                    Real vs Synthetic
                </span>

            </div>


            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-800">

                <div
                    className="bg-emerald-400"
                    style={{
                        width: `${clamp(realValue)}%`
                    }}
                />

                <div
                    className="bg-rose-400"
                    style={{
                        width: `${clamp(fakeValue)}%`
                    }}
                />

            </div>


            <div className="mt-3 flex justify-between text-xs">

                <span className="text-emerald-400">
                    Real {realValue.toFixed(2)}%
                </span>

                <span className="text-rose-400">
                    Fake {fakeValue.toFixed(2)}%
                </span>

            </div>

        </div>
    );
}


// ============================================================
// AUDIO SEGMENTS
// ============================================================

function AudioSegments({
    segments
}) {

    return (

        <details className="mt-7 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">

            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 font-medium text-slate-200">

                <Waves
                    size={17}
                    className="text-blue-400"
                />

                Inspect Audio Segments

                <span className="text-slate-600">
                    ({segments.length})
                </span>

                <ChevronDown
                    size={16}
                    className="ml-auto text-slate-600"
                />

            </summary>


            <div className="overflow-x-auto border-t border-slate-800">

                <table className="min-w-full text-left text-sm">

                    <thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-600">

                        <tr>

                            <th className="px-5 py-3 pr-6">
                                Segment
                            </th>

                            <th className="px-5 py-3 pr-6">
                                Authentic
                            </th>

                            <th className="px-5 py-3 pr-6">
                                Synthetic
                            </th>

                            <th className="px-5 py-3 pr-6">
                                Reliability
                            </th>

                            <th className="px-5 py-3">
                                Agreement
                            </th>

                        </tr>

                    </thead>


                    <tbody className="divide-y divide-slate-800">

                        {segments.map(
                            (segment, index) => (

                                <tr
                                    key={
                                        segment.segment ??
                                        index
                                    }
                                    className="text-slate-300 transition hover:bg-slate-900"
                                >

                                    <td className="px-5 py-3">
                                        {segment.segment ??
                                            index + 1}
                                    </td>


                                    <td className="px-5 py-3 text-emerald-300">
                                        {percent(
                                            segment.real_probability
                                        )}
                                    </td>


                                    <td className="px-5 py-3 text-rose-300">
                                        {percent(
                                            segment.fake_probability
                                        )}
                                    </td>


                                    <td className="px-5 py-3">

                                        {segment.reliability !== undefined
                                            ? `${(
                                                Number(
                                                    segment.reliability
                                                ) * 100
                                            ).toFixed(1)}%`
                                            : "--"}

                                    </td>


                                    <td className="px-5 py-3">

                                        {segment.model_agreement !== undefined
                                            ? `${(
                                                Number(
                                                    segment.model_agreement
                                                ) * 100
                                            ).toFixed(1)}%`
                                            : "--"}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </details>
    );
}

function VideoModelCard({
    number,
    title,
    value,
    primary = false,
    note = "Frame averaged",
}) {

    const numericValue = Number(value);

    const safeValue =
        Number.isFinite(numericValue)
            ? clamp(numericValue)
            : 0;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.45,
            }}
            whileHover={{
                y: -3,
            }}
            className={`
                group rounded-2xl border p-5
                transition
                ${
                    primary
                        ? "border-blue-500/25 bg-blue-500/[0.04]"
                        : "border-slate-800 bg-slate-950/70"
                }
                hover:border-slate-700
            `}
        >

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className={`
                            flex h-9 w-9 items-center justify-center
                            rounded-xl text-xs font-bold
                            ${
                                primary
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "bg-slate-800 text-slate-400"
                            }
                        `}
                    >
                        {number}
                    </div>

                    <div>

                        <p className="font-semibold text-slate-200">
                            {title}
                        </p>

                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-600">
                            Video detector
                        </p>

                    </div>

                </div>

                <ScanLine
                    size={16}
                    className={
                        primary
                            ? "text-blue-400"
                            : "text-slate-600"
                    }
                />

            </div>


            {/* VALUE */}

            <div className="mt-6 flex items-end gap-1">

                <span className="text-3xl font-black tabular-nums text-rose-300">
                    {
                        Number.isFinite(numericValue)
                            ? numericValue.toFixed(2)
                            : "--"
                    }
                </span>

                <span className="mb-1 text-sm text-slate-600">
                    %
                </span>

            </div>


            <p className="mt-1 text-xs text-slate-500">
                Synthetic evidence
            </p>


            {/* PROGRESS */}

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">

                <motion.div
                    initial={{
                        width: 0,
                    }}
                    animate={{
                        width: `${safeValue}%`,
                    }}
                    transition={{
                        duration: 0.9,
                        ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-rose-400"
                />

            </div>


            {/* FOOTER */}

            <div className="mt-3 flex items-center justify-between">

                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                    Fake probability
                </span>

                <span className="text-[10px] font-medium text-slate-500">
                    {note}
                </span>

            </div>

        </motion.div>
    );
}


// ============================================================
// ANIMATED VERDICT
// ============================================================

function AnimatedVerdict({
    verdict,
    confidence,
}) {

    const normalized =
        String(verdict || "")
            .toUpperCase()
            .trim();

    const isDeepfake =
        normalized === "DEEPFAKE" ||
        normalized === "AI GENERATED" ||
        normalized === "AI-GENERATED";

    const isAuthentic =
        normalized === "AUTHENTIC" ||
        normalized === "REAL";

    const label =
        isDeepfake
            ? "DEEPFAKE"
            : isAuthentic
                ? "AUTHENTIC"
                : "SUSPICIOUS";

    const numericConfidence =
        Number(confidence);

    const safeConfidence =
        Number.isFinite(numericConfidence)
            ? clamp(numericConfidence)
            : 0;

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            transition={{
                duration: 0.55,
                ease: "easeOut",
            }}
        >

            <motion.span
                initial={{
                    opacity: 0,
                    scale: 0.7,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    delay: 0.15,
                    duration: 0.35,
                }}
                className={`
                    inline-flex items-center gap-2
                    rounded-full border px-3 py-1.5
                    text-xs font-bold uppercase
                    tracking-wider
                    ${
                        isDeepfake
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                            : isAuthentic
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    }
                `}
            >

                <span
                    className={`
                        h-1.5 w-1.5 rounded-full
                        ${
                            isDeepfake
                                ? "bg-rose-400"
                                : isAuthentic
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                        }
                    `}
                />

                {label}

            </motion.span>


            <div className="mt-4 flex items-end gap-2">

                <motion.span
                    initial={{
                        opacity: 0,
                        y: 8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.25,
                    }}
                    className="
                        text-5xl
                        font-black
                        tracking-tight
                        text-slate-100
                    "
                >
                    {safeConfidence.toFixed(2)}
                </motion.span>

                <span className="mb-2 text-lg text-slate-500">
                    %
                </span>

            </div>


            <p className="mt-1 text-sm text-slate-500">
                Detection confidence
            </p>


            <div className="mt-5 max-w-xl">

                <div className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-slate-800
                ">

                    <motion.div
                        initial={{
                            width: 0,
                        }}
                        animate={{
                            width: `${safeConfidence}%`,
                        }}
                        transition={{
                            delay: 0.35,
                            duration: 1,
                            ease: "easeOut",
                        }}
                        className={`
                            h-full rounded-full
                            ${
                                isDeepfake
                                    ? "bg-rose-400"
                                    : isAuthentic
                                        ? "bg-emerald-400"
                                        : "bg-amber-400"
                            }
                        `}
                    />

                </div>

            </div>

        </motion.div>
    );
}

function Metric({
    label,
    value,
    danger = false
}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-slate-700">

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {label}
            </p>


            <p
                className={`
                    mt-2 text-2xl font-bold tabular-nums
                    ${
                        danger
                            ? "text-rose-300"
                            : "text-slate-100"
                    }
                `}
            >
                {value}
            </p>

        </div>
    );
}


// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
    label,
    value
}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {label}
            </p>


            <p className="mt-2 break-all text-sm font-medium leading-6 text-slate-200">
                {value}
            </p>

        </div>
    );
}


// ============================================================
// QUICK METRIC
// ============================================================

function QuickMetric({
    icon,
    label,
    value
}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

            <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                    {icon}
                </div>


                <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ============================================================
// STATUS PILL
// ============================================================

function StatusPill({
    label,
    value
}) {

    return (

        <div className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5">

            <span className="text-[10px] uppercase tracking-wider text-slate-600">
                {label}
            </span>

            <span className="ml-2 text-xs font-medium text-slate-300">
                {value}
            </span>

        </div>
    );
}


// ============================================================
// MODEL CARD
// ============================================================

function ModelCard({
    title,
    data
}) {

    if (!data) {

        return (

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

                <h3 className="font-semibold">
                    {title}
                </h3>

                <p className="mt-4 text-sm text-slate-600">
                    No model data available.
                </p>

            </div>
        );
    }


    const real =
        data.real_probability !== undefined
            ? Number(
                data.real_probability
            ).toFixed(2)
            : "--";


    const fake =
        data.fake_probability !== undefined
            ? Number(
                data.fake_probability
            ).toFixed(2)
            : "--";


    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

            <div className="flex items-center gap-2">

                <ScanLine
                    size={16}
                    className="text-blue-400"
                />

                <h3 className="font-semibold">
                    {title}
                </h3>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-4">

                <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Authentic
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-300">
                        {real}%
                    </p>

                </div>


                <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Synthetic
                    </p>

                    <p className="mt-1 text-xl font-bold text-rose-300">
                        {fake}%
                    </p>

                </div>

            </div>


            <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-slate-800">

                <div
                    className="bg-emerald-400"
                    style={{
                        width: `${clamp(
                            Number(real)
                        )}%`
                    }}
                />

                <div
                    className="bg-rose-400"
                    style={{
                        width: `${clamp(
                            Number(fake)
                        )}%`
                    }}
                />

            </div>

        </div>
    );
}


// ============================================================
// MEDIA ICON
// ============================================================

function MediaIcon({
    media
}) {

    if (media === "video") {

        return (
            <FileVideo
                size={17}
                className="shrink-0 text-violet-400"
            />
        );
    }


    if (media === "audio") {

        return (
            <FileAudio
                size={17}
                className="shrink-0 text-amber-400"
            />
        );
    }


    if (media === "image") {

        return (
            <FileImage
                size={17}
                className="shrink-0 text-blue-400"
            />
        );
    }


    return (
        <FileText
            size={17}
            className="shrink-0 text-slate-500"
        />
    );
}


// ============================================================
// HELPERS
// ============================================================

function normalizeVerdict(value) {

    const verdict =
        String(
            value ||
            "UNKNOWN"
        )
            .toUpperCase()
            .trim();


    if (
        verdict === "AI GENERATED" ||
        verdict === "AI-GENERATED" ||
        verdict === "AI_GENERATED"
    ) {
        return "DEEPFAKE";
    }


    return verdict;
}


function percent(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "--";
    }


    return `${number.toFixed(2)}%`;
}


function clamp(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return 0;
    }


    return Math.max(
        0,
        Math.min(
            100,
            number
        )
    );
}


function capitalize(value) {

    const text =
        String(
            value ||
            "unknown"
        );


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}


function shortenId(value) {

    const text =
        String(value);


    if (text.length <= 18) {
        return text;
    }


    return `${text.slice(0, 8)}...${text.slice(-6)}`;
}


function countEvidence(result) {

    let count = 0;


    if (result.video) {
        count++;
    }

    if (result.audio) {
        count++;
    }

    if (result.lipsync) {
        count++;
    }

    if (result.metadata) {
        count++;
    }

    if (result.models) {
        count++;
    }


    return `${count} signal${count === 1 ? "" : "s"}`;
}


function formatLabel(value) {

    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}


function formatBytes(bytes) {

    const value =
        Number(bytes);


    if (!Number.isFinite(value)) {
        return "--";
    }


    if (value < 1024) {
        return `${value} B`;
    }


    if (value < 1024 * 1024) {

        return `${(
            value / 1024
        ).toFixed(2)} KB`;
    }


    if (value < 1024 * 1024 * 1024) {

        return `${(
            value /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    }


    return `${(
        value /
        (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
}
