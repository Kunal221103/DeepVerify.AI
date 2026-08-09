import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";

export default function Reports() {

    const navigate = useNavigate();

    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadReports() {

            try {

                const data = await getHistory();

                setScans(Array.isArray(data) ? data : []);

            } catch (error) {

                console.error("Failed to load reports:", error);

            } finally {

                setLoading(false);

            }

        }

        loadReports();

    }, []);

    const getVerdictStyle = (verdict) => {

        switch (verdict) {

            case "AUTHENTIC":
                return "text-green-400 bg-green-400/10";

            case "SUSPICIOUS":
                return "text-yellow-400 bg-yellow-400/10";

            case "DEEPFAKE":
            case "AI GENERATED":
                return "text-red-400 bg-red-400/10";

            default:
                return "text-slate-400 bg-slate-400/10";
        }

    };

    return (

        <Layout>

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Reports
                </h1>

                <p className="text-slate-400 mt-2">
                    View and download your DeepVerify AI reports.
                </p>

            </div>

            {loading ? (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                    <p className="text-slate-400">
                        Loading reports...
                    </p>

                </div>

            ) : scans.length === 0 ? (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                    <h2 className="text-xl font-semibold">
                        No reports yet
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Run your first AI scan to generate a report.
                    </p>

                    <button
                        onClick={() => navigate("/upload")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                    >
                        Start a Scan
                    </button>

                </div>

            ) : (

                <div className="space-y-4">

                    {scans.map((scan, index) => {

                        const scanId =
                            scan.scan_id ||
                            scan._id;

                        const filename =
                            scan.original_name ||
                            scan.filename ||
                            `Scan ${index + 1}`;

                        const verdict =
                            scan.verdict ||
                            "UNKNOWN";

                        return (

                            <div
                                key={scanId}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition"
                            >

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                    <div className="min-w-0">

                                        <h2 className="font-semibold text-lg truncate">
                                            {filename}
                                        </h2>

                                        <div className="flex flex-wrap items-center gap-3 mt-3">

                                            <span className="text-sm text-slate-400 capitalize">
                                                {scan.media || "Unknown"}
                                            </span>

                                            <span className="text-sm text-slate-400">
                                                Score: {scan.score ?? "--"}%
                                            </span>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getVerdictStyle(verdict)}`}
                                            >
                                                {verdict}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex gap-3">

                                        <button
                                            onClick={() =>
                                                navigate("/result", {
                                                    state: scan
                                                })
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </button>

                                        <a
                                            href={`http://127.0.0.1:8000/api/report/${scanId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
                                        >
                                            PDF
                                        </a>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </Layout>

    );
}