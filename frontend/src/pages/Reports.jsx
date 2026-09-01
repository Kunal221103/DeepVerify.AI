import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    CheckCircle2,
    Download,
    FileAudio,
    FileImage,
    FileText,
    FileVideo,
    Search,
    ShieldCheck,
    UploadCloud,
    X,
} from "lucide-react";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";


const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api";


export default function Reports() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    // ==========================================================
    // LOAD REPORTS
    // ==========================================================

    useEffect(() => {

        async function loadReports() {

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
                    "Failed to load reports:",
                    error
                );

                setHistory([]);

            } finally {

                setLoading(false);

            }

        }

        loadReports();

    }, []);


    // ==========================================================
    // FILTER
    // ==========================================================

    const reports = useMemo(() => {

        const query =
            search
                .trim()
                .toLowerCase();


        return history.filter(
            (scan) => {

                const filename =
                    String(
                        scan.original_name ||
                        scan.filename ||
                        scan.result?.original_name ||
                        ""
                    ).toLowerCase();


                const verdict =
                    normalizeVerdict(
                        scan
                    ).toLowerCase();


                const media =
                    String(
                        scan.media ||
                        scan.media_type ||
                        scan.result?.media ||
                        ""
                    ).toLowerCase();


                return (
                    !query ||
                    filename.includes(query) ||
                    verdict.includes(query) ||
                    media.includes(query)
                );

            }
        );

    }, [
        history,
        search
    ]);


    // ==========================================================
    // REPORT PAGE
    // ==========================================================

    return (

        <Layout>

            <div className="mx-auto max-w-7xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="
                    mb-8
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                ">

                    <div>

                        <div className="
                                 flex
                                 items-center
                                 gap-2
                                 rounded-xl
                                 bg-blue-600
                                 px-4
                                 py-2.5
                                 text-sm
                                 font-medium
                                 text-white
                                 transition
                                 hover:bg-blue-700
                                ">

                            <FileText
                                size={16}
                            />

                            Documentation

                        </div>


                        <h1 className="
                            mt-2
                            text-3xl
                            font-bold
                            tracking-tight
                            sm:text-4xl
                        ">
                            Reports
                        </h1>


                        <p className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-500
                        ">
                            Access and download detailed authenticity
                            analysis reports generated from completed scans.
                        </p>

                    </div>


                    <Link
                        to="/upload"
                        className="
                            flex
                            w-fit
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-600/10
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
                    STATISTICS
                ================================================== */}

                <div className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                ">

                    <ReportStat
                        label="Available Reports"
                        value={history.length}
                        icon={
                            <FileText
                                size={20}
                            />
                        }
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />


                    <ReportStat
                        label="PDF Ready"
                        value={history.length}
                        icon={
                            <Download
                                size={20}
                            />
                        }
                        color="text-emerald-400"
                        bg="bg-emerald-500/10"
                    />


                    <ReportStat
                        label="Analysis Engine"
                        value="Online"
                        icon={
                            <ShieldCheck
                                size={20}
                            />
                        }
                        color="text-violet-400"
                        bg="bg-violet-500/10"
                    />

                </div>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="
                    mt-6
                    rounded-3xl
                    border border-slate-800
                    bg-slate-900
                    p-4
                    shadow-lg
                ">

                    <div className="relative">

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
                                (event) =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            placeholder="Search reports, files, media types, or verdicts..."
                            className="
                                w-full
                                rounded-xl
                                border border-slate-800
                                bg-slate-950
                                py-3
                                pl-11
                                pr-11
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
                                    p-1.5
                                    text-slate-500
                                    transition
                                    hover:bg-slate-800
                                    hover:text-slate-200
                                "
                                aria-label="Clear search"
                            >

                                <X
                                    size={16}
                                />

                            </button>

                        )}

                    </div>

                </div>


                {/* ==================================================
                    REPORT LIST
                ================================================== */}

                <section className="
                    mt-6
                    overflow-hidden
                    rounded-3xl
                    border border-slate-800
                    bg-slate-900
                    shadow-lg
                ">


                    {/* HEADER */}

                    <div className="
                        border-b
                        border-slate-800
                        px-5
                        py-5
                        sm:px-6
                    ">

                        <div className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <div>

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <span className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-blue-400
                                    "/>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                        text-slate-100
                                    ">
                                        Generated Reports
                                    </h2>

                                </div>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-600
                                ">
                                    Download the PDF report associated
                                    with each completed scan.
                                </p>

                            </div>


                            <div className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wider
                                text-slate-600
                            ">
                                {reports.length} available
                            </div>

                        </div>

                    </div>


                    {/* COLUMN HEADERS */}

                    {!loading &&
                    reports.length > 0 && (

                        <div className="
                            hidden
                            border-b
                            border-slate-800
                            bg-slate-950/40
                            px-6
                            py-3
                            md:flex
                            md:items-center
                        ">

                            <div className="
                                flex-1
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-slate-600
                            ">
                                Report
                            </div>


                            <div className="
                                w-36
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-slate-600
                            ">
                                Verdict
                            </div>


                            <div className="
                                w-28
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-slate-600
                            ">
                                Confidence
                            </div>


                            <div className="
                                w-44
                                text-right
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-slate-600
                            ">
                                Actions
                            </div>

                        </div>

                    )}


                    {/* CONTENT */}

                    {loading ? (

                        <ReportsLoading />

                    ) : reports.length === 0 ? (

                        <EmptyReports
                            hasSearch={
                                Boolean(search)
                            }
                            clearSearch={() =>
                                setSearch("")
                            }
                        />

                    ) : (

                        <div className="
                            divide-y
                            divide-slate-800
                        ">

                            {reports.map(
                                (scan, index) => (

                                    <ReportRow
                                        key={
                                            scan.scan_id ||
                                            scan._id ||
                                            index
                                        }
                                        scan={scan}
                                        apiBaseUrl={
                                            API_BASE_URL
                                        }
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
// REPORT ROW
// ============================================================

function ReportRow({
    scan,
    apiBaseUrl
}) {

    const scanId =
        scan.scan_id ||
        scan._id;


    const filename =
        scan.original_name ||
        scan.filename ||
        scan.result?.original_name ||
        "Unknown file";


    const media =
        String(
            scan.media ||
            scan.media_type ||
            scan.result?.media ||
            "unknown"
        ).toLowerCase();


    const verdict =
        normalizeVerdict(
            scan
        );


    const score =
        scan.score ??
        scan.result?.score ??
        scan.confidence ??
        scan.result?.confidence;


    const reportPath =
        scan.report ||
        scan.result?.report;


    /*
     * Keep the same working report endpoint
     * already used by the Result page.
     */

    const reportUrl =
        scanId
            ? `${apiBaseUrl}/report/${scanId}`
            : reportPath
                ? reportPath
                : null;


    return (

        <div className="
            group
            flex
            flex-col
            gap-5
            px-5
            py-5
            transition-all
            duration-200
            hover:bg-slate-950/60
            sm:px-6
            lg:flex-row
            lg:items-center
        ">


            {/* ==================================================
                FILE
            ================================================== */}

            <div className="
                flex
                min-w-0
                flex-1
                items-center
                gap-4
            ">

                <div className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-950
                    transition
                    group-hover:border-slate-700
                ">

                    <MediaIcon
                        media={media}
                    />

                </div>


                <div className="min-w-0">

                    <p className="
                        truncate
                        font-semibold
                        text-slate-200
                        transition-colors
                        group-hover:text-blue-400
                    ">
                        {filename}
                    </p>


                    <div className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        text-xs
                        text-slate-600
                    ">

                        <span className="capitalize">
                            {media}
                        </span>


                        <span>
                            •
                        </span>


                        <span>
                            Scan ID: {scanId || "--"}
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                VERDICT
            ================================================== */}

            <div className="lg:w-36">

                <p className="
                    mb-1
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-slate-600
                    lg:hidden
                ">
                    Verdict
                </p>


                <VerdictBadge
                    verdict={verdict}
                />

            </div>


            {/* ==================================================
                SCORE
            ================================================== */}

            <div className="lg:w-28">

                <p className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-slate-600
                    lg:hidden
                ">
                    Confidence
                </p>


                <p className="
                    mt-1
                    font-semibold
                    tabular-nums
                    text-slate-200
                    lg:mt-0
                ">

                    {score !== undefined &&
                    score !== null &&
                    Number.isFinite(
                        Number(score)
                    )
                        ? `${Number(score).toFixed(2)}%`
                        : "--"}

                </p>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="
                flex
                flex-wrap
                gap-2
                lg:w-44
                lg:justify-end
            ">

                {scanId && (

                    <Link
                        to={`/result/${scanId}`}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-950
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-300
                            transition
                            hover:border-blue-500/30
                            hover:text-blue-400
                        "
                    >

                        View

                        <ArrowRight
                            size={15}
                        />

                    </Link>

                )}


                {reportUrl && (

                    <a
                        href={reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-700
                        "
                    >

                        <Download
                            size={16}
                        />

                        PDF

                    </a>

                )}

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

        <FileText
            size={22}
            className="text-slate-500"
        />

    );
}


// ============================================================
// VERDICT
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
                px-3
                py-1.5
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
// REPORT STAT
// ============================================================

function ReportStat({
    label,
    value,
    icon,
    color,
    bg
}) {

    return (

        <div className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-5
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-slate-700
        ">

            <div className="
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
                        {label}
                    </p>


                    <p className={`
                        mt-3
                        text-3xl
                        font-black
                        tracking-tight
                        tabular-nums
                        ${color}
                    `}>
                        {value}
                    </p>

                </div>


                <div className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${bg}
                    ${color}
                    transition-transform
                    duration-300
                    group-hover:scale-110
                `}>
                    {icon}
                </div>

            </div>


            <div className="
                mt-4
                flex
                items-center
                gap-2
            ">

                <CheckCircle2
                    size={13}
                    className="text-emerald-400"
                />

                <span className="
                    text-[10px]
                    text-slate-600
                ">
                    System record
                </span>

            </div>

        </div>

    );
}


// ============================================================
// EMPTY
// ============================================================

function EmptyReports({
    hasSearch,
    clearSearch
}) {

    return (

        <div className="
            px-6
            py-16
            text-center
        ">

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

                <FileText
                    size={25}
                    className="text-slate-600"
                />

            </div>


            <h3 className="
                mt-5
                text-lg
                font-semibold
                text-slate-200
            ">

                {hasSearch
                    ? "No matching reports"
                    : "No reports available"}

            </h3>


            <p className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
            ">

                {hasSearch
                    ? "Try another search term."
                    : "Reports will appear here after completing a scan."}

            </p>


            {hasSearch ? (

                <button
                    type="button"
                    onClick={
                        clearSearch
                    }
                    className="
                        mt-6
                        rounded-xl
                        bg-slate-800
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-200
                        transition
                        hover:bg-slate-700
                    "
                >
                    Clear Search
                </button>

            ) : (

                <Link
                    to="/upload"
                    className="
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-2.5
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

    );
}


// ============================================================
// LOADING
// ============================================================

function ReportsLoading() {

    return (

        <div className="
            divide-y
            divide-slate-800
        ">

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
                            px-6
                            py-5
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
                                w-1/4
                                animate-pulse
                                rounded
                                bg-slate-800
                            " />

                        </div>


                        <div className="
                            h-8
                            w-20
                            animate-pulse
                            rounded-xl
                            bg-slate-800
                        " />

                    </div>

                )
            )}

        </div>

    );
}