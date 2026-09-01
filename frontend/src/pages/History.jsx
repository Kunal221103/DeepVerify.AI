import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    FileAudio,
    FileImage,
    FileVideo,
    History as HistoryIcon,
    Search,
    ShieldAlert,
    UploadCloud,
    XCircle,
} from "lucide-react";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";


export default function History() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");


    // ==========================================================
    // LOAD HISTORY
    // ==========================================================

    useEffect(() => {

        async function loadHistory() {

            try {

                const data =
                    await getHistory();

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

                setHistory([]);

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

        const query =
            search
                .trim()
                .toLowerCase();


        return history.filter(
            (scan) => {

                const verdict =
                    normalizeVerdict(
                        scan
                    );


                const filename =
                    String(
                        scan.original_name ||
                        scan.filename ||
                        scan.result?.original_name ||
                        ""
                    ).toLowerCase();


                const media =
                    String(
                        scan.media ||
                        scan.media_type ||
                        scan.result?.media ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !query ||
                    filename.includes(query) ||
                    media.includes(query) ||
                    verdict
                        .toLowerCase()
                        .includes(query);


                const matchesFilter =
                    filter === "ALL" ||
                    verdict === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );

    }, [
        history,
        search,
        filter
    ]);


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const statistics = useMemo(() => {

        const total =
            history.length;


        const authentic =
            history.filter(
                scan =>
                    normalizeVerdict(
                        scan
                    ) === "AUTHENTIC"
            ).length;


        const suspicious =
            history.filter(
                scan =>
                    normalizeVerdict(
                        scan
                    ) === "SUSPICIOUS"
            ).length;


        const deepfake =
            history.filter(
                scan =>
                    normalizeVerdict(
                        scan
                    ) === "DEEPFAKE"
            ).length;


        return {
            total,
            authentic,
            suspicious,
            deepfake
        };

    }, [history]);


    // ==========================================================
    // CLEAR FILTERS
    // ==========================================================

    const clearFilters = () => {

        setSearch("");
        setFilter("ALL");

    };


    // ==========================================================
    // PAGE
    // ==========================================================

    return (

        <Layout>

            <div className="mx-auto max-w-7xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    <div>

                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">

                            <HistoryIcon
                                size={16}
                            />

                            Analysis Records

                        </div>


                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Scan History
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Review previous media authenticity analyses
                            and inspect individual detection results.
                        </p>

                    </div>


                    <Link
                        to="/upload"
                        className="
                            flex w-fit items-center gap-2
                            rounded-xl
                            bg-blue-600
                            px-5 py-3
                            text-sm font-semibold
                            text-white
                            shadow-lg shadow-blue-600/10
                            transition
                            hover:bg-blue-700
                        "
                    >

                        <UploadCloud
                            size={18}
                        />

                        New Scan

                    </Link>

                </div>


                {/* ==================================================
                    SUMMARY
                ================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <SummaryCard
                        title="Total"
                        value={statistics.total}
                        icon={
                            <HistoryIcon
                                size={19}
                            />
                        }
                        color="text-blue-400"
                    />


                    <SummaryCard
                        title="Authentic"
                        value={statistics.authentic}
                        icon={
                            <CheckCircle2
                                size={19}
                            />
                        }
                        color="text-emerald-400"
                    />


                    <SummaryCard
                        title="Suspicious"
                        value={statistics.suspicious}
                        icon={
                            <AlertTriangle
                                size={19}
                            />
                        }
                        color="text-amber-400"
                    />


                    <SummaryCard
                        title="Deepfake"
                        value={statistics.deepfake}
                        icon={
                            <ShieldAlert
                                size={19}
                            />
                        }
                        color="text-rose-400"
                    />

                </div>


                {/* ==================================================
                    SEARCH / FILTER
                ================================================== */}

                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-lg">

                    <div className="flex flex-col gap-4 lg:flex-row">


                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                "
                            />


                            <input
                                type="text"
                                value={search}
                                onChange={
                                    event =>
                                        setSearch(
                                            event.target.value
                                        )
                                }
                                placeholder="Search files, media types, or verdicts..."
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-800
                                    bg-slate-950
                                    py-3
                                    pl-11
                                    pr-10
                                    text-sm
                                    text-slate-200
                                    outline-none
                                    transition
                                    placeholder:text-slate-600
                                    focus:border-blue-500/50
                                "
                            />


                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        rounded-lg
                                        p-1
                                        text-slate-500
                                        transition
                                        hover:bg-slate-800
                                        hover:text-white
                                    "
                                >

                                    <XCircle
                                        size={17}
                                    />

                                </button>

                            )}

                        </div>


                        {/* FILTERS */}

                        <div className="flex flex-wrap gap-2">

                            <FilterButton
                                label="All"
                                active={
                                    filter === "ALL"
                                }
                                onClick={() =>
                                    setFilter("ALL")
                                }
                            />


                            <FilterButton
                                label="Authentic"
                                active={
                                    filter === "AUTHENTIC"
                                }
                                onClick={() =>
                                    setFilter(
                                        "AUTHENTIC"
                                    )
                                }
                            />


                            <FilterButton
                                label="Suspicious"
                                active={
                                    filter === "SUSPICIOUS"
                                }
                                onClick={() =>
                                    setFilter(
                                        "SUSPICIOUS"
                                    )
                                }
                            />


                            <FilterButton
                                label="Deepfake"
                                active={
                                    filter === "DEEPFAKE"
                                }
                                onClick={() =>
                                    setFilter(
                                        "DEEPFAKE"
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    RESULTS
                ================================================== */}

                <section className="
                    mt-6
                    overflow-hidden
                    rounded-3xl
                    border border-slate-800
                    bg-slate-900
                    shadow-lg
                ">


                    {/* ==================================================
                        RESULTS HEADER
                    ================================================== */}

                    <div className="border-b border-slate-800 px-5 py-5 sm:px-6">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="h-2 w-2 rounded-full bg-blue-400" />

                                    <h2 className="text-lg font-semibold text-slate-100">
                                        Previous Scans
                                    </h2>

                                </div>


                                <p className="mt-1 text-xs text-slate-600">

                                    {filteredHistory.length} result
                                    {filteredHistory.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    found

                                </p>

                            </div>


                            {/* ACTIVE FILTER */}

                            {(search ||
                                filter !== "ALL") && (

                                <div className="flex flex-wrap items-center gap-2">

                                    {filter !== "ALL" && (

                                        <span className="
                                            rounded-lg
                                            border border-blue-500/20
                                            bg-blue-500/5
                                            px-2.5 py-1.5
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-blue-400
                                        ">
                                            {filter}
                                        </span>

                                    )}


                                    {search && (

                                        <span className="
                                            max-w-[180px]
                                            truncate
                                            rounded-lg
                                            border border-slate-800
                                            bg-slate-950
                                            px-2.5 py-1.5
                                            text-[10px]
                                            text-slate-500
                                        ">
                                            "{search}"
                                        </span>

                                    )}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        COLUMN HEADERS
                    ================================================== */}

                    {!loading &&
                        filteredHistory.length > 0 && (

                            <div className="
                                hidden
                                border-b border-slate-800
                                bg-slate-950/40
                                px-6 py-3
                                md:flex
                                md:items-center
                            ">

                                <div className="
                                    w-[42%]
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                ">
                                    Media
                                </div>


                                <div className="
                                    w-[18%]
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                ">
                                    Confidence
                                </div>


                                <div className="
                                    w-[22%]
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                ">
                                    Verdict
                                </div>


                                <div className="
                                    flex-1
                                    text-right
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                ">
                                    Details
                                </div>

                            </div>

                        )}


                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    {loading ? (

                        <HistoryLoading />

                    ) : filteredHistory.length === 0 ? (

                        <EmptyHistory
                            hasFilters={
                                Boolean(search) ||
                                filter !== "ALL"
                            }
                            clearFilters={
                                clearFilters
                            }
                        />

                    ) : (

                        <div className="divide-y divide-slate-800">

                            {filteredHistory.map(
                                (scan, index) => (

                                    <HistoryRow
                                        key={
                                            scan.scan_id ||
                                            scan._id ||
                                            index
                                        }
                                        scan={scan}
                                    />

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>

        </Layout>

    );
}


// ============================================================
// HISTORY ROW
// ============================================================

function HistoryRow({
    scan
}) {

    const verdict =
        normalizeVerdict(
            scan
        );


    const media =
        String(
            scan.media ||
            scan.media_type ||
            scan.result?.media ||
            "unknown"
        ).toLowerCase();


    const filename =
        scan.original_name ||
        scan.filename ||
        scan.result?.original_name ||
        "Unknown file";


    const score =
        scan.score ??
        scan.result?.score ??
        scan.confidence ??
        scan.result?.confidence;


    const scanId =
        scan.scan_id ||
        scan._id;


    const row = (

        <div
            className="
                group
                relative
                flex
                flex-col
                gap-4
                px-5 py-5
                transition-all
                duration-200
                hover:bg-slate-950/60
                sm:px-6
                md:flex-row
                md:items-center
            "
        >

            {/* ==================================================
                MEDIA
            ================================================== */}

            <div className="flex items-center gap-4 md:w-[42%]">

                <div
                    className="
                        flex
                        h-12 w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border border-slate-800
                        bg-slate-950
                        transition-all
                        duration-200
                        group-hover:border-slate-700
                        group-hover:bg-slate-900
                    "
                >

                    <MediaIcon
                        media={media}
                    />

                </div>


                <div className="min-w-0">

                    <p
                        className="
                            truncate
                            font-semibold
                            text-slate-200
                            transition-colors
                            group-hover:text-blue-400
                        "
                    >
                        {filename}
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        capitalize
                        text-slate-500
                    ">
                        {media}
                    </p>

                </div>

            </div>


            {/* ==================================================
                SCORE
            ================================================== */}

            <div className="md:w-[18%]">

                <p className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-slate-600
                    md:hidden
                ">
                    Confidence
                </p>


                <div className="mt-1 md:mt-0">

                    <p className="
                        text-lg
                        font-semibold
                        tabular-nums
                        text-slate-200
                    ">

                        {score !== undefined &&
                        score !== null &&
                        Number.isFinite(
                            Number(score)
                        )
                            ? `${Number(score).toFixed(2)}%`
                            : "--"}

                    </p>


                    {score !== undefined &&
                    score !== null &&
                    Number.isFinite(
                        Number(score)
                    ) && (

                        <div className="
                            mt-1.5
                            h-1
                            w-20
                            overflow-hidden
                            rounded-full
                            bg-slate-800
                        ">

                            <div
                                className="
                                    h-full
                                    rounded-full
                                    bg-blue-500
                                    transition-all
                                "
                                style={{
                                    width: `${Math.min(
                                        Math.max(
                                            Number(score),
                                            0
                                        ),
                                        100
                                    )}%`
                                }}
                            />

                        </div>

                    )}

                </div>

            </div>


            {/* ==================================================
                VERDICT
            ================================================== */}

            <div className="md:w-[22%]">

                <p className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-slate-600
                    md:hidden
                ">
                    Verdict
                </p>


                <div className="mt-1 md:mt-0">

                    <VerdictBadge
                        verdict={verdict}
                    />

                </div>

            </div>


            {/* ==================================================
                ARROW
            ================================================== */}

            <div className="ml-auto hidden md:block">

                <ArrowRight
                    size={19}
                    className="
                        text-slate-600
                        transition
                        group-hover:translate-x-1
                        group-hover:text-blue-400
                    "
                />

            </div>

        </div>

    );


    // ==========================================================
    // NAVIGATION
    // ==========================================================

    if (!scanId) {

        return row;

    }


    return (

        <Link
            to={`/result/${scanId}`}
            className="block"
        >
            {row}
        </Link>

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
                size={22}
                className="text-violet-400"
            />

        );

    }


    if (media === "audio") {

        return (

            <FileAudio
                size={22}
                className="text-amber-400"
            />

        );

    }


    if (media === "image") {

        return (

            <FileImage
                size={22}
                className="text-blue-400"
            />

        );

    }


    return (

        <FileImage
            size={22}
            className="text-slate-500"
        />

    );
}


// ============================================================
// VERDICT BADGE
// ============================================================

function VerdictBadge({
    verdict
}) {

    const config = {

        AUTHENTIC:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

        SUSPICIOUS:
            "border-amber-500/20 bg-amber-500/10 text-amber-400",

        DEEPFAKE:
            "border-rose-500/20 bg-rose-500/10 text-rose-400",

    };


    return (

        <span
            className={`
                inline-flex
                rounded-lg
                border
                px-3 py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                ${
                    config[verdict] ||
                    "border-slate-700 bg-slate-800 text-slate-400"
                }
            `}
        >
            {verdict}
        </span>

    );
}


// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
    title,
    value,
    icon,
    color
}) {

    const iconBg =
        color.includes("emerald")
            ? "bg-emerald-500/10"
            : color.includes("amber")
                ? "bg-amber-500/10"
                : color.includes("rose")
                    ? "bg-rose-500/10"
                    : "bg-blue-500/10";


    const dotColor =
        color.includes("emerald")
            ? "bg-emerald-400"
            : color.includes("amber")
                ? "bg-amber-400"
                : color.includes("rose")
                    ? "bg-rose-400"
                    : "bg-blue-400";


    return (

        <div className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border border-slate-800
            bg-slate-900
            p-5
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-slate-700
        ">

            {/* Background glow */}

            <div
                className={`
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    blur-3xl
                    opacity-20
                    ${iconBg}
                `}
            />


            <div className="
                relative
                flex
                items-center
                justify-between
            ">

                <div>

                    <p className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-slate-600
                    ">
                        {title}
                    </p>


                    <p
                        className={`
                            mt-3
                            text-3xl
                            font-black
                            tabular-nums
                            tracking-tight
                            ${color}
                        `}
                    >
                        {value}
                    </p>

                </div>


                <div
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        ${iconBg}
                        ${color}
                        transition-transform
                        duration-300
                        group-hover:scale-110
                    `}
                >
                    {icon}
                </div>

            </div>


            <div className="
                relative
                mt-4
                flex
                items-center
                gap-2
            ">

                <span
                    className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${dotColor}
                    `}
                />


                <span className="text-[10px] text-slate-600">
                    Recorded analyses
                </span>

            </div>

        </div>

    );
}


// ============================================================
// FILTER BUTTON
// ============================================================

function FilterButton({
    label,
    active,
    onClick
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-xl
                px-4 py-2.5
                text-sm
                font-medium
                transition
                ${
                    active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                        : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }
            `}
        >
            {label}
        </button>

    );
}


// ============================================================
// EMPTY HISTORY
// ============================================================

function EmptyHistory({
    hasFilters,
    clearFilters
}) {

    return (

        <div className="px-6 py-16 text-center">

            <div className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-slate-950
            ">

                <HistoryIcon
                    size={25}
                    className="text-slate-600"
                />

            </div>


            <h3 className="mt-5 text-lg font-semibold text-slate-200">

                {hasFilters
                    ? "No matching scans"
                    : "No scan history"}

            </h3>


            <p className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
            ">

                {hasFilters
                    ? "Try changing your search or verdict filter."
                    : "Your completed media analyses will appear here."}

            </p>


            <div className="
                mt-6
                flex
                justify-center
                gap-3
            ">

                {hasFilters ? (

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="
                            rounded-xl
                            bg-slate-800
                            px-5 py-2.5
                            text-sm
                            font-medium
                            text-slate-200
                            transition
                            hover:bg-slate-700
                        "
                    >
                        Clear Filters
                    </button>

                ) : (

                    <Link
                        to="/upload"
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5 py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-700
                        "
                    >

                        <UploadCloud
                            size={17}
                        />

                        Start a Scan

                    </Link>

                )}

            </div>

        </div>

    );
}


// ============================================================
// LOADING
// ============================================================

function HistoryLoading() {

    return (

        <div className="divide-y divide-slate-800">

            {Array.from({
                length: 5
            }).map(
                (_, index) => (

                    <div
                        key={index}
                        className="
                            flex
                            items-center
                            gap-4
                            px-6 py-5
                        "
                    >

                        <div className="
                            h-12
                            w-12
                            animate-pulse
                            rounded-xl
                            bg-slate-800
                        " />


                        <div className="flex-1">

                            <div className="
                                h-4
                                w-1/3
                                animate-pulse
                                rounded
                                bg-slate-800
                            " />


                            <div className="
                                mt-2
                                h-3
                                w-20
                                animate-pulse
                                rounded
                                bg-slate-800
                            " />

                        </div>


                        <div className="
                            h-6
                            w-20
                            animate-pulse
                            rounded
                            bg-slate-800
                        " />

                    </div>

                )
            )}

        </div>

    );
}


// ============================================================
// NORMALIZE VERDICT
// ============================================================

function normalizeVerdict(
    scan
) {

    const verdict =
        String(
            scan?.verdict ||
            scan?.result?.verdict ||
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

