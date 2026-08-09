import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";

export default function History() {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [verdictFilter, setVerdictFilter] = useState("ALL");
    const [mediaFilter, setMediaFilter] = useState("ALL");

    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getHistory();

                setHistory(Array.isArray(data) ? data : []);

            } catch (error) {

                console.error("Failed to load history:", error);

            } finally {

                setLoading(false);

            }

        }

        loadHistory();

    }, []);

    const filteredHistory = useMemo(() => {

        return history.filter((scan) => {

            const filename =
                scan.original_name ||
                scan.filename ||
                "";

            const matchesSearch =
                filename
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesVerdict =
                verdictFilter === "ALL" ||
                scan.verdict === verdictFilter;

            const matchesMedia =
                mediaFilter === "ALL" ||
                scan.media === mediaFilter;

            return (
                matchesSearch &&
                matchesVerdict &&
                matchesMedia
            );

        });

    }, [
        history,
        search,
        verdictFilter,
        mediaFilter
    ]);

    const getVerdictClass = (verdict) => {

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

    const openResult = (scan) => {

        navigate(`/result/${scan.scan_id || scan._id}`, {
            state: scan
        });

    };

    return (

        <Layout>

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Scan History
                </h1>

                <p className="text-slate-400 mt-2">
                    Review previous DeepVerify AI scans
                </p>

            </div>

            {/* Filters */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

                <div className="grid md:grid-cols-3 gap-4">

                    <input
                        type="text"
                        placeholder="Search filename..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <select
                        value={verdictFilter}
                        onChange={(e) =>
                            setVerdictFilter(e.target.value)
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
                    >

                        <option value="ALL">
                            All Verdicts
                        </option>

                        <option value="AUTHENTIC">
                            Authentic
                        </option>

                        <option value="SUSPICIOUS">
                            Suspicious
                        </option>

                        <option value="DEEPFAKE">
                            Deepfake
                        </option>

                    </select>

                    <select
                        value={mediaFilter}
                        onChange={(e) =>
                            setMediaFilter(e.target.value)
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
                    >

                        <option value="ALL">
                            All Media
                        </option>

                        <option value="image">
                            Images
                        </option>

                        <option value="video">
                            Videos
                        </option>

                        <option value="audio">
                            Audio
                        </option>

                    </select>

                </div>

            </div>

            {/* History */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

                {loading ? (

                    <div className="p-8 text-center text-slate-400">
                        Loading history...
                    </div>

                ) : filteredHistory.length === 0 ? (

                    <div className="p-8 text-center text-slate-400">
                        No scans found.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-950">

                                <tr>

                                    <th className="text-left p-4">
                                        File
                                    </th>

                                    <th className="text-left p-4">
                                        Media
                                    </th>

                                    <th className="text-left p-4">
                                        Score
                                    </th>

                                    <th className="text-left p-4">
                                        Verdict
                                    </th>

                                    <th className="text-left p-4">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredHistory.map(
                                    (scan, index) => {

                                        const filename =
                                            scan.original_name ||
                                            scan.filename ||
                                            "Unknown file";

                                        return (

                                            <tr
                                                key={
                                                    scan.scan_id ||
                                                    scan._id ||
                                                    index
                                                }
                                                className="border-t border-slate-800 hover:bg-slate-800/50"
                                            >

                                                <td className="p-4">

                                                    {filename}

                                                </td>

                                                <td className="p-4 capitalize">

                                                    {scan.media ||
                                                        "unknown"}

                                                </td>

                                                <td className="p-4">

                                                    {scan.score != null
                                                        ? `${scan.score}%`
                                                        : "--"}

                                                </td>

                                                <td
                                                    className={`p-4 font-semibold ${getVerdictClass(
                                                        scan.verdict
                                                    )}`}
                                                >

                                                    {scan.verdict ||
                                                        "UNKNOWN"}

                                                </td>

                                                <td className="p-4">

                                                    <button
                                                        onClick={() =>
                                                            openResult(scan)
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </Layout>

    );

}