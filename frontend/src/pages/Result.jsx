import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    CircleHelp,
    FileDown,
    FileSearch,
    Plus,
    ShieldAlert,
    Sparkles
} from "lucide-react";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";


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

            setScan(
                location.state
            );

            setLoading(false);

            return;
        }


        if (!scanId) {

            setLoading(false);

            return;
        }


        async function loadScan() {

            try {

                const history =
                    await getHistory();


                const foundScan =
                    history.find(
                        (item) =>
                            item.scan_id === scanId ||
                            item._id === scanId
                    );


                setScan(
                    foundScan || null
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

    }, [
        location.state,
        scanId
    ]);


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <Layout>

                <div className="flex items-center justify-center py-20">

                    <div className="text-center">

                        <div className="text-2xl font-semibold">
                            Loading scan...
                        </div>

                        <p className="text-slate-400 mt-2">
                            Retrieving analysis results.
                        </p>

                    </div>

                </div>

            </Layout>
        );
    }


    // ==========================================================
    // NO RESULT
    // ==========================================================

    if (!scan) {

        return (

            <Layout>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                    <h1 className="text-3xl font-bold">
                        Scan Not Found
                    </h1>

                    <p className="text-slate-400 mt-2">
                        The requested scan could not be found.
                    </p>

                    <div className="flex gap-3 mt-6">

                        <button
                            onClick={() =>
                                navigate("/history")
                            }
                            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg"
                        >
                            Back to History
                        </button>

                        <button
                            onClick={() =>
                                navigate("/upload")
                            }
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                        >
                            New Scan
                        </button>

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
                    scan.result.score,

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
                    scan.result.filename
            }
            : scan;


    // ==========================================================
    // BASIC VALUES
    // ==========================================================

    const verdict =
        result.verdict ||
        "UNKNOWN";


    const confidence =
        result.confidence !== undefined &&
        result.confidence !== null
            ? Number(
                result.confidence
            ).toFixed(2)
            : "--";


    const realProbability =
        result.real_probability !== undefined &&
        result.real_probability !== null
            ? Number(
                result.real_probability
            ).toFixed(2)
            : "--";


    const fakeProbability =
        result.fake_probability !== undefined &&
        result.fake_probability !== null
            ? Number(
                result.fake_probability
            ).toFixed(2)
            : "--";


    const reportId =
        result.scan_id ||
        scan.scan_id ||
        scan._id;

    const fakeScore = Number(result.fake_probability);

    const realScore = Number(result.real_probability);

    const scoreAvailable = Number.isFinite(fakeScore);

    const verdictMeta = {
        AUTHENTIC: {
            label: "No strong synthetic evidence detected",
            icon: CheckCircle2,
            accent: "emerald",
            note: "The available evidence is more consistent with authentic media. This is not proof of origin."
        },
        DEEPFAKE: {
            label: "Strong synthetic or manipulated evidence detected",
            icon: ShieldAlert,
            accent: "rose",
            note: "Review the modality evidence and source media before making a decision."
        },
        SUSPICIOUS: {
            label: "Evidence is mixed or needs review",
            icon: AlertTriangle,
            accent: "amber",
            note: "A human reviewer should inspect the source file and supporting evidence."
        },
        UNKNOWN: {
            label: "Analysis verdict unavailable",
            icon: CircleHelp,
            accent: "slate",
            note: "The scan did not return enough evidence for a final classification."
        }
    }[verdict] || {
        label: "Analysis verdict unavailable",
        icon: CircleHelp,
        accent: "slate",
        note: "The scan did not return enough evidence for a final classification."
    };

    const VerdictIcon = verdictMeta.icon;

    const audioReliability = Number(result.audio?.audio_reliability);

    const modelAgreement = Number(result.audio?.model_agreement);


    // ==========================================================
    // VERDICT STYLE
    // ==========================================================

    const getVerdictStyle = () => {

        if (verdict === "AUTHENTIC") {

            return "text-green-400";
        }

        if (verdict === "DEEPFAKE") {

            return "text-red-400";
        }

        if (verdict === "SUSPICIOUS") {

            return "text-yellow-400";
        }

        return "text-slate-400";
    };


    // ==========================================================
    // MODEL EVIDENCE
    // ==========================================================

    const modelEvidence =
        result.image?.model_evidence ||
        {};


    const models =
        result.models ||
        {};


    // ==========================================================
    // ENSEMBLE
    // ==========================================================

    const ensemble =
        result.ensemble ||
        {};


    // ==========================================================
    // PAGE
    // ==========================================================

    return (

        <Layout>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                        <FileSearch size={17} />
                        FORENSIC ANALYSIS REPORT
                    </div>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Scan result
                    </h1>

                    <p className="mt-2 max-w-2xl text-slate-400">
                        Evidence-led assessment for {result.original_name || result.filename || "the submitted media file"}.
                    </p>

                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Scan identifier</p>
                    <p className="mt-1 font-mono text-slate-200">{reportId || "Not available"}</p>
                </div>

            </div>


            {/* ==================================================
                FINAL RESULT
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/30">

                <div className="grid lg:grid-cols-[1.2fr_0.8fr]">

                    <div className="p-6 sm:p-8">

                        <div className="flex items-start gap-4">

                            <div className={`rounded-xl p-3 ${
                                verdictMeta.accent === "emerald" ? "bg-emerald-500/15 text-emerald-300" :
                                verdictMeta.accent === "rose" ? "bg-rose-500/15 text-rose-300" :
                                verdictMeta.accent === "amber" ? "bg-amber-500/15 text-amber-300" :
                                "bg-slate-700 text-slate-300"
                            }`}>
                                <VerdictIcon size={28} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Final assessment</p>
                                <h2 className={`mt-2 text-3xl font-bold ${getVerdictStyle()}`}>{verdict}</h2>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{verdictMeta.label}</p>
                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-800 pt-5 text-sm text-slate-400">
                            <span className="font-medium text-slate-300">Reviewer note:</span> {verdictMeta.note}
                        </div>

                    </div>

                    <div className="border-t border-slate-800 bg-slate-950/50 p-6 sm:p-8 lg:border-l lg:border-t-0">

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Confidence</p>
                        <p className="mt-3 text-5xl font-bold tabular-nums text-white">{confidence}<span className="text-2xl text-slate-500">%</span></p>
                        <p className="mt-3 text-sm leading-6 text-slate-400">Confidence reflects the strength of the combined model evidence, not certainty about the media's origin.</p>

                    </div>

                </div>

                {scoreAvailable && (
                    <div className="border-t border-slate-800 bg-slate-950/30 px-6 py-5 sm:px-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <p className="font-medium text-slate-200">Evidence balance</p>
                            <p className="tabular-nums text-slate-400">Authentic {Number.isFinite(realScore) ? realScore.toFixed(2) : "--"}% · Synthetic {fakeScore.toFixed(2)}%</p>
                        </div>
                        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-800" aria-label={`Evidence balance: authentic ${realScore} percent, synthetic ${fakeScore} percent`}>
                            <div className="bg-emerald-400" style={{ width: `${Math.max(0, Math.min(100, realScore))}%` }} />
                            <div className="bg-rose-400" style={{ width: `${Math.max(0, Math.min(100, fakeScore))}%` }} />
                        </div>
                    </div>
                )}

            </section>


            {/* ==================================================
                PROBABILITIES
            ================================================== */}

            {(result.media === "image" ||
                result.media === "video" ||
                result.media === "audio") && (

                <div className="grid gap-4 md:grid-cols-2 mt-6">
                    <EvidenceMetric label="Authentic evidence" value={realProbability} tone="real" description="Evidence consistent with non-synthetic media" />
                    <EvidenceMetric label="Synthetic evidence" value={fakeProbability} tone="fake" description="Evidence consistent with generated or manipulated media" />
                </div>
            )}


            {/* ==================================================
                SCAN INFORMATION
            ================================================== */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                <h2 className="text-xl font-semibold mb-5">
                    Scan Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    <Info
                        label="Media Type"
                        value={
                            result.media ||
                            result.media_type ||
                            "--"
                        }
                    />


                    <Info
                        label="File"
                        value={
                            result.original_name ||
                            result.filename ||
                            "--"
                        }
                    />


                    <Info
                        label="Scan ID"
                        value={
                            reportId ||
                            "--"
                        }
                    />

                </div>

            </div>


            {/* ==================================================
                IMAGE MODEL EVIDENCE
            ================================================== */}

            {result.media === "image" && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <div className="mb-5">

                        <h2 className="text-xl font-semibold">
                            AI Model Evidence
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                            Results from three independent image detection models.
                        </p>

                    </div>


                    <div className="grid md:grid-cols-3 gap-4">

                        <ModelCard
                            title="Model 1"
                            subtitle="AI Image Detector"
                            data={
                                modelEvidence.model_1 ||
                                models.model_1
                            }
                        />


                        <ModelCard
                            title="Model 2"
                            subtitle="Steganography Detector"
                            data={
                                modelEvidence.model_2 ||
                                models.model_2
                            }
                        />


                        <ModelCard
                            title="Model 3"
                            subtitle="SDXL Detector"
                            data={
                                modelEvidence.model_3 ||
                                models.model_3
                            }
                        />

                    </div>

                </div>
            )}


            {/* ==================================================
                IMAGE ANALYSIS
            ================================================== */}

            {result.image && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Image Analysis
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Info
                            label="Image Score"
                            value={
                                result.image.confidence ??
                                result.score ??
                                "--"
                            }
                        />


                        <Info
                            label="Real Probability"
                            value={
                                result.image.real_probability !== undefined
                                    ? `${result.image.real_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Fake Probability"
                            value={
                                result.image.fake_probability !== undefined
                                    ? `${result.image.fake_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Prediction"
                            value={
                                result.image.prediction ||
                                verdict
                            }
                        />

                    </div>

                </div>
            )}


            {/* ==================================================
                FORENSIC ANALYSIS
            ================================================== */}

            {(result.ela ||
                result.noise) && (

                <div className="grid md:grid-cols-2 gap-6 mt-6">

                    {result.ela && (

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                            <h2 className="text-xl font-semibold">
                                ELA Analysis
                            </h2>

                            <div className="mt-5">

                                <Info
                                    label="ELA Score"
                                    value={
                                        result.ela.ela_score ??
                                        "--"
                                    }
                                />

                            </div>

                        </div>
                    )}


                    {result.noise && (

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                            <h2 className="text-xl font-semibold">
                                Noise Analysis
                            </h2>

                            <div className="mt-5 space-y-3">

                                <Info
                                    label="Noise Score"
                                    value={
                                        result.noise.noise_score ??
                                        "--"
                                    }
                                />


                                <Info
                                    label="Noise Variance"
                                    value={
                                        result.noise.noise_variance ??
                                        "--"
                                    }
                                />

                            </div>

                        </div>
                    )}

                </div>
            )}


            {/* ==================================================
                METADATA
            ================================================== */}

            {result.metadata && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Metadata Analysis
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">

                        <Info
                            label="Metadata Score"
                            value={
                                result.metadata.metadata_score ??
                                "--"
                            }
                        />


                        <Info
                            label="File Size"
                            value={
                                result.metadata.file_size !== undefined
                                    ? `${result.metadata.file_size} bytes`
                                    : "--"
                            }
                        />

                    </div>

                </div>
            )}


            {/* ==================================================
                VIDEO ANALYSIS
            ================================================== */}

            {result.video && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Video Analysis
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Info
                            label="Authenticity Score"
                            value={
                                result.video.face_score !== undefined
                                    ? `${result.video.face_score}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Fake Probability"
                            value={
                                result.video.fake_probability !== undefined
                                    ? `${result.video.fake_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Frames Analyzed"
                            value={
                                result.video.frames_analyzed ??
                                "--"
                            }
                        />


                        <Info
                            label="Fake Frame Ratio"
                            value={
                                result.video.fake_frame_ratio !== undefined
                                    ? `${result.video.fake_frame_ratio}%`
                                    : "--"
                            }
                        />

                    </div>

                    {result.video.model_scores && (
                        <div className="mt-6 border-t border-slate-800 pt-5">
                            <p className="text-sm font-medium text-slate-200">Visual model evidence</p>
                            <p className="mt-1 text-sm text-slate-400">Per-model synthetic-evidence scores across sampled frames.</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {Object.entries(result.video.model_scores).map(([name, value]) => (
                                    <Info key={name} label={name.replaceAll("_", " ").replace("probability", "evidence")} value={value !== null && value !== undefined ? `${Number(value).toFixed(2)}%` : "Not available"} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}


            {/* ==================================================
                MULTIMODAL VIDEO ANALYSIS
            ================================================== */}

            {result.media === "video" &&
                result.ensemble && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold mb-2">
                        Multimodal Analysis
                    </h2>

                    <p className="text-slate-400 text-sm mb-5">
                        Final assessment combines visual and audio evidence.
                    </p>


                    <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-400">
                        Voice results are model evidence, not speaker identification. Background speech, music, compression, and edits can reduce reliability.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Info
                            label="Visual Fake Evidence"
                            value={
                                ensemble.visual_fake_probability !== undefined
                                    ? `${ensemble.visual_fake_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Audio Fake Evidence"
                            value={
                                ensemble.audio_fake_probability !== undefined
                                    ? `${ensemble.audio_fake_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Visual Weight"
                            value={
                                ensemble.visual_weight !== undefined
                                    ? `${ensemble.visual_weight * 100}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Audio Weight"
                            value={
                                ensemble.audio_weight !== undefined
                                    ? `${ensemble.audio_weight * 100}%`
                                    : "--"
                            }
                        />

                        <Info
                            label="Raw Fake Evidence"
                            value={
                                result.audio.raw_fake_probability !== undefined
                                    ? `${result.audio.raw_fake_probability}%`
                                    : "--"
                            }
                        />

                        <Info
                            label="Audio Reliability"
                            value={
                                Number.isFinite(audioReliability)
                                    ? `${(audioReliability * 100).toFixed(1)}%`
                                    : "Not available"
                            }
                        />

                        <Info
                            label="Model Agreement"
                            value={
                                Number.isFinite(modelAgreement)
                                    ? `${(modelAgreement * 100).toFixed(1)}%`
                                    : "Not available"
                            }
                        />

                    </div>

                    {result.audio.segment_predictions?.length > 0 && (
                        <details className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                            <summary className="cursor-pointer font-medium text-slate-200">Inspect segment-level audio evidence ({result.audio.segment_predictions.length} segments)</summary>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                                        <tr><th className="pb-3 pr-4">Segment</th><th className="pb-3 pr-4">Authentic</th><th className="pb-3 pr-4">Synthetic</th><th className="pb-3 pr-4">Signal reliability</th><th className="pb-3">Model agreement</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-slate-300">
                                        {result.audio.segment_predictions.map((segment) => (
                                            <tr key={segment.segment}>
                                                <td className="py-3 pr-4">{segment.segment}</td>
                                                <td className="py-3 pr-4 text-emerald-300">{segment.real_probability}%</td>
                                                <td className="py-3 pr-4 text-rose-300">{segment.fake_probability}%</td>
                                                <td className="py-3 pr-4">{segment.reliability !== undefined ? `${(Number(segment.reliability) * 100).toFixed(1)}%` : "--"}</td>
                                                <td className="py-3">{segment.model_agreement !== undefined ? `${(Number(segment.model_agreement) * 100).toFixed(1)}%` : "--"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    )}

                </div>
            )}


            {/* ==================================================
                AUDIO ANALYSIS
            ================================================== */}

            {result.audio && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Audio Analysis
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Info
                            label="Voice Score"
                            value={
                                result.audio.voice_score !== undefined
                                    ? `${result.audio.voice_score}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Real Probability"
                            value={
                                result.audio.real_probability !== undefined
                                    ? `${result.audio.real_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Fake Probability"
                            value={
                                result.audio.fake_probability !== undefined
                                    ? `${result.audio.fake_probability}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Duration"
                            value={
                                result.audio.duration !== undefined
                                    ? `${result.audio.duration} sec`
                                    : "--"
                            }
                        />

                    </div>

                </div>
            )}


            {/* ==================================================
                LIP SYNC
            ================================================== */}

            {result.lipsync && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold">
                        Lip-Sync Analysis
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4 mt-5">

                        <Info
                            label="Lip-Sync Score"
                            value={
                                result.lipsync.lipsync_score !== undefined
                                    ? `${result.lipsync.lipsync_score}%`
                                    : "--"
                            }
                        />


                        <Info
                            label="Frames Analyzed"
                            value={
                                result.lipsync.frames_analyzed ??
                                "--"
                            }
                        />


                        <Info
                            label="Mouth Motion"
                            value={
                                result.lipsync.mouth_motion ??
                                "--"
                            }
                        />

                    </div>

                </div>
            )}


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-wrap gap-4 mt-8">

                <button
                    onClick={() =>
                        navigate("/upload")
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                >
                    New Scan
                </button>


                <button
                    onClick={() =>
                        navigate("/history")
                    }
                    className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg"
                >
                    Back to History
                </button>


                {reportId && (

                    <a
                        href={`http://127.0.0.1:8000/api/report/${reportId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
                    >
                        Download PDF
                    </a>

                )}

            </div>


            {/* ==================================================
                RAW DATA
            ================================================== */}

            <details className="mt-8">

                <summary className="cursor-pointer text-slate-400">
                    View raw analysis data
                </summary>

                <pre className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-auto text-sm">
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
// INFO COMPONENT
// ============================================================

function Info({
    label,
    value
}) {

    return (

        <div className="bg-slate-950 rounded-lg p-4">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-medium break-all">
                {value}
            </p>

        </div>
    );
}


// ============================================================
// MODEL CARD
// ============================================================

function ModelCard({
    title,
    subtitle,
    data
}) {

    if (!data) {

        return (

            <div className="bg-slate-950 rounded-xl p-5">

                <h3 className="font-semibold">
                    {title}
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                    {subtitle}
                </p>

                <p className="text-slate-500 mt-5">
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

        <div className="bg-slate-950 rounded-xl p-5">

            <h3 className="font-semibold">
                {title}
            </h3>

            <p className="text-slate-500 text-sm mt-1">
                {subtitle}
            </p>


            <div className="mt-5 space-y-3">

                <div>

                    <p className="text-xs text-slate-500">
                        REAL
                    </p>

                    <p className="text-xl font-semibold text-green-400">
                        {real}%
                    </p>

                </div>


                <div>

                    <p className="text-xs text-slate-500">
                        FAKE / AI
                    </p>

                    <p className="text-xl font-semibold text-red-400">
                        {fake}%
                    </p>

                </div>

            </div>

        </div>
    );
}
