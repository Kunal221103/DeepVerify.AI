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


    // ==========================================================
    // LOAD HISTORY
    // ==========================================================

    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getHistory();

                setHistory(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load history:",
                    error
                );

            } finally {

                setLoading(false);
            }
        }


        loadHistory();

    }, []);


    // ==========================================================
    // FILTER HISTORY
    // ==========================================================

    const filteredHistory = useMemo(() => {

        return history.filter((scan) => {

            const filename =
                scan.original_name ||
                scan.filename ||
                scan.result?.original_name ||
                "";


            const media =
                scan.media ||
                scan.media_type ||
                scan.result?.media ||
                scan.result?.media_type ||
                "";


            const verdict =
                scan.verdict ||
                scan.result?.verdict ||
                "";


            const matchesSearch =
                filename
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const matchesVerdict =
                verdictFilter === "ALL" ||
                verdict === verdictFilter;


            const matchesMedia =
                mediaFilter === "ALL" ||
                media === mediaFilter;


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


    // ==========================================================
    // VERDICT COLOR
    // ==========================================================

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


    // ==========================================================
    // MEDIA COLOR
    // ==========================================================

    const getMediaClass = (media) => {

        if (media === "image") {

            return "text-blue-400";
        }

        if (media === "video") {

            return "text-purple-400";
        }

        if (media === "audio") {

            return "text-orange-400";
        }

        return "text-slate-400";
    };


    // ==========================================================
    // OPEN RESULT
    // ==========================================================

    const openResult = (scan) => {

        const id =
            scan.scan_id ||
            scan._id ||
            scan.result?.scan_id;


        if (!id) {

            console.error(
                "Scan ID missing:",
                scan
            );

            return;
        }


        navigate(
            `/result/${id}`,
            {
                state: scan
            }
        );

    };


    // ==========================================================
    // GET SCORE
    // ==========================================================

    const getScore = (scan) => {

        const score =
            scan.score ??
            scan.result?.score;


        if (
            score === undefined ||
            score === null
        ) {

            return "--";
        }


        return `${Number(score).toFixed(2)}%`;
    };


    // ==========================================================
    // GET REAL PROBABILITY
    // ==========================================================

    const getRealProbability = (scan) => {

        const value =
            scan.real_probability ??
            scan.result?.real_probability;


        if (
            value === undefined ||
            value === null
        ) {

            return "--";
        }


        return `${Number(value).toFixed(2)}%`;
    };


    // ==========================================================
    // GET FAKE PROBABILITY
    // ==========================================================

    const getFakeProbability = (scan) => {

        const value =
            scan.fake_probability ??
            scan.result?.fake_probability;


        if (
            value === undefined ||
            value === null
        ) {

            return "--";
        }


        return `${Number(value).toFixed(2)}%`;
    };


    // ==========================================================
    // PAGE
    // ==========================================================

    return (

        <Layout>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Scan History
                </h1>

                <p className="text-slate-400 mt-2">
                    Review previous DeepVerify AI scans
                </p>

            </div>


            {/* ==================================================
                FILTERS
            ================================================== */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

                <div className="grid md:grid-cols-3 gap-4">

                    <input
                        type="text"
                        placeholder="Search filename..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />


                    <select
                        value={verdictFilter}
                        onChange={(e) =>
                            setVerdictFilter(
                                e.target.value
                            )
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
                            setMediaFilter(
                                e.target.value
                            )
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


            {/* ==================================================
                HISTORY TABLE
            ================================================== */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

                {loading ? (

                    <div className="p-10 text-center text-slate-400">

                        Loading history...

                    </div>

                ) : filteredHistory.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-slate-400">
                            No scans found.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/upload")
                            }
                            className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
                        >
                            Start New Scan
                        </button>

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
                                        Real
                                    </th>

                                    <th className="text-left p-4">
                                        Fake
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
                                            scan.result?.original_name ||
                                            "Unknown file";


                                        const media =
                                            scan.media ||
                                            scan.media_type ||
                                            scan.result?.media ||
                                            scan.result?.media_type ||
                                            "unknown";


                                        const verdict =
                                            scan.verdict ||
                                            scan.result?.verdict ||
                                            "UNKNOWN";


                                        return (

                                            <tr
                                                key={
                                                    scan.scan_id ||
                                                    scan._id ||
                                                    index
                                                }
                                                className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                                            >

                                                {/* FILE */}

                                                <td className="p-4 max-w-xs">

                                                    <div
                                                        className="truncate font-medium"
                                                        title={filename}
                                                    >
                                                        {filename}
                                                    </div>

                                                </td>


                                                {/* MEDIA */}

                                                <td
                                                    className={`p-4 capitalize font-medium ${getMediaClass(
                                                        media
                                                    )}`}
                                                >

                                                    {media}

                                                </td>


                                                {/* SCORE */}

                                                <td className="p-4 font-semibold">

                                                    {getScore(scan)}

                                                </td>


                                                {/* REAL */}

                                                <td className="p-4">

                                                    <span className="text-green-400">
                                                        {getRealProbability(
                                                            scan
                                                        )}
                                                    </span>

                                                </td>


                                                {/* FAKE */}

                                                <td className="p-4">

                                                    <span className="text-red-400">
                                                        {getFakeProbability(
                                                            scan
                                                        )}
                                                    </span>

                                                </td>


                                                {/* VERDICT */}

                                                <td
                                                    className={`p-4 font-semibold ${getVerdictClass(
                                                        verdict
                                                    )}`}
                                                >

                                                    {verdict}

                                                </td>


                                                {/* ACTION */}

                                                <td className="p-4">

                                                    <button
                                                        onClick={() =>
                                                            openResult(
                                                                scan
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
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


            {/* ==================================================
                RESULT COUNT
            ================================================== */}

            {!loading &&
                filteredHistory.length > 0 && (

                    <p className="text-sm text-slate-500 mt-4">

                        Showing{" "}
                        {filteredHistory.length}{" "}
                        of{" "}
                        {history.length}{" "}
                        scans

                    </p>

                )}

        </Layout>
    );
}