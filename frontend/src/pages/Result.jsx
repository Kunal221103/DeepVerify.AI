import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import { useEffect, useState } from "react";

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
    // LOAD SCAN FROM HISTORY WHEN OPENED USING /result/:scanId
    // ==========================================================

    useEffect(() => {

        // If History already supplied the scan data,
        // there is nothing else to load.
        if (location.state) {

            setScan(location.state);
            setLoading(false);

            return;
        }


        // No ID means there is nothing to search for.
        if (!scanId) {

            setLoading(false);

            return;
        }


        async function loadScan() {

            try {

                const history = await getHistory();

                const foundScan = history.find(
                    (item) =>
                        item.scan_id === scanId ||
                        item._id === scanId
                );


                if (foundScan) {

                    setScan(foundScan);

                } else {

                    setScan(null);

                }

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
                            onClick={() => navigate("/history")}
                            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg"
                        >
                            Back to History
                        </button>

                        <button
                            onClick={() => navigate("/upload")}
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
    // NORMALIZE DATABASE / FRESH SCAN DATA
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

                verdict:
                    scan.verdict ||
                    scan.result.verdict ||
                    "UNKNOWN",

                original_name:
                    scan.original_name ||
                    scan.result.original_name
            }
            : scan;


    const verdict =
        result.verdict || "UNKNOWN";


    const score =
        result.score !== undefined &&
        result.score !== null
            ? result.score
            : "--";


    // ==========================================================
    // VERDICT STYLE
    // ==========================================================

    const getVerdictStyle = () => {

        if (verdict === "AUTHENTIC") {

            return "text-green-400";

        }

        if (
            verdict === "DEEPFAKE" ||
            verdict === "AI GENERATED"
        ) {

            return "text-red-400";

        }

        if (verdict === "SUSPICIOUS") {

            return "text-yellow-400";

        }

        return "text-slate-400";

    };


    const reportId =
        result.scan_id ||
        scan.scan_id ||
        scan._id;


    // ==========================================================
    // PAGE
    // ==========================================================

    return (

        <Layout>

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Detection Result
                </h1>

                <p className="text-slate-400 mt-2">
                    AI-powered media authenticity analysis
                </p>

            </div>


            {/* ==================================================
                VERDICT + SCORE
            ================================================== */}

            <div className="grid lg:grid-cols-2 gap-6">


                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <p className="text-slate-400 text-sm">
                        VERDICT
                    </p>

                    <h2
                        className={`text-4xl font-bold mt-3 ${getVerdictStyle()}`}
                    >
                        {verdict}
                    </h2>

                </div>


                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <p className="text-slate-400 text-sm">
                        CONFIDENCE SCORE
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {score}%
                    </h2>

                </div>

            </div>


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
                            scan.media_type ||
                            "--"
                        }
                    />


                    <Info
                        label="File"
                        value={
                            result.original_name ||
                            scan.original_name ||
                            scan.filename ||
                            "--"
                        }
                    />


                    <Info
                        label="Scan ID"
                        value={reportId || "--"}
                    />

                </div>

            </div>


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
                                result.image.image_score ??
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
                            label="Resolution"
                            value={
                                result.image.resolution ||
                                "--"
                            }
                        />

                    </div>

                </div>

            )}


            {/* ==================================================
                ELA + NOISE
            ================================================== */}

            {(result.ela || result.noise) && (

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
                VIDEO ANALYSIS
            ================================================== */}

            {result.video && (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Video Analysis
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">

                        <Info
                            label="Face Score"
                            value={
                                result.video.face_score ??
                                "--"
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

                    </div>

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
                                result.audio.voice_score ??
                                "--"
                            }
                        />

                        <Info
                            label="MFCC"
                            value={
                                result.audio.mfcc ??
                                "--"
                            }
                        />

                        <Info
                            label="RMS"
                            value={
                                result.audio.rms ??
                                "--"
                            }
                        />

                        <Info
                            label="ZCR"
                            value={
                                result.audio.zcr ??
                                "--"
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

                    <div className="mt-5">

                        <Info
                            label="Lip-Sync Score"
                            value={
                                result.lipsync.lipsync_score ??
                                "--"
                            }
                        />

                    </div>

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
                                result.metadata.file_size
                                    ? `${result.metadata.file_size} bytes`
                                    : "--"
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
                    onClick={() => navigate("/upload")}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                >
                    New Scan
                </button>


                <button
                    onClick={() => navigate("/history")}
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
                DEBUG DATA
            ================================================== */}

            <details className="mt-8">

                <summary className="cursor-pointer text-slate-400">
                    View raw analysis data
                </summary>

                <pre className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-auto text-sm">
                    {JSON.stringify(result, null, 2)}
                </pre>

            </details>

        </Layout>

    );

}


// ============================================================
// INFO COMPONENT
// ============================================================

function Info({ label, value }) {

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