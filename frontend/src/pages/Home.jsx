import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    FileVideo,
    ScanFace,
    ShieldCheck,
    UploadCloud,
} from "lucide-react";

import Layout from "../components/Layout/Layout";
import { getHistory } from "../services/historyService";


export default function Home() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);


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

                setHistory([]);

            } finally {

                setLoading(false);

            }
        }

        loadHistory();

    }, []);


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const statistics = useMemo(() => {

        const total = history.length;

        const authentic = history.filter(
            scan =>
                String(scan.verdict || "")
                    .toUpperCase() === "AUTHENTIC"
        ).length;

        const deepfake = history.filter(
            scan => {

                const verdict =
                    String(
                        scan.verdict || ""
                    ).toUpperCase();

                return (
                    verdict === "DEEPFAKE" ||
                    verdict === "AI GENERATED" ||
                    verdict === "AI-GENERATED"
                );
            }
        ).length;

        const suspicious = history.filter(
            scan =>
                String(scan.verdict || "")
                    .toUpperCase() === "SUSPICIOUS"
        ).length;

        const videos = history.filter(
            scan =>
                String(
                    scan.media ||
                    scan.media_type ||
                    ""
                ).toLowerCase() === "video"
        ).length;

        return {
            total,
            authentic,
            deepfake,
            suspicious,
            videos,
        };

    }, [history]);


    const recentScans =
        history.slice(0, 5);


    return (

        <Layout>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">

                        <Activity size={17} />

                        Command Center

                    </div>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Monitor your media authenticity analysis.
                    </p>

                </div>


                <Link
                    to="/upload"
                    className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
                >

                    <UploadCloud size={18} />

                    New Scan

                </Link>

            </div>


            {loading ? (

                <DashboardLoading />

            ) : (

                <>

                    {/* ==================================================
                        STAT CARDS
                    ================================================== */}

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Total Scans"
                            value={statistics.total}
                            icon={<ScanFace size={21} />}
                            description="All analyzed media"
                            iconClass="text-blue-400"
                            iconBackground="bg-blue-500/10"
                        />

                        <StatCard
                            title="Authentic"
                            value={statistics.authentic}
                            icon={<ShieldCheck size={21} />}
                            description="Classified as authentic"
                            iconClass="text-emerald-400"
                            iconBackground="bg-emerald-500/10"
                        />

                        <StatCard
                            title="Deepfake"
                            value={statistics.deepfake}
                            icon={<AlertTriangle size={21} />}
                            description="Strong synthetic evidence"
                            iconClass="text-rose-400"
                            iconBackground="bg-rose-500/10"
                        />

                        <StatCard
                            title="Videos"
                            value={statistics.videos}
                            icon={<FileVideo size={21} />}
                            description="Video analyses"
                            iconClass="text-violet-400"
                            iconBackground="bg-violet-500/10"
                        />

                    </div>


                    {/* ==================================================
                        MAIN CONTENT
                    ================================================== */}

                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">


                        {/* ==================================================
                            RECENT ACTIVITY
                        ================================================== */}

                        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold">
                                        Recent Activity
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Latest media authenticity scans.
                                    </p>

                                </div>


                                <Link
                                    to="/history"
                                    className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
                                >
                                    View all
                                    <ArrowRight size={15} />
                                </Link>

                            </div>


                            <div className="mt-6">

                                {recentScans.length === 0 ? (

                                    <EmptyActivity />

                                ) : (

                                    <div className="divide-y divide-slate-800">

                                        {recentScans.map(
                                            (scan, index) => (

                                                <RecentScan
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

                            </div>

                        </section>


                        {/* ==================================================
                            SYSTEM STATUS
                        ================================================== */}

                        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

                            <div className="flex items-center gap-2">

                                <Activity
                                    size={19}
                                    className="text-blue-400"
                                />

                                <h2 className="text-xl font-semibold">
                                    System Status
                                </h2>

                            </div>


                            <div className="mt-6 space-y-3">

                                <StatusRow
                                    label="Image Detection"
                                    status="Operational"
                                />

                                <StatusRow
                                    label="Video Detection"
                                    status="Operational"
                                />

                                <StatusRow
                                    label="Audio Detection"
                                    status="Operational"
                                />

                                <StatusRow
                                    label="Lip-Sync Analysis"
                                    status="Operational"
                                />

                                <StatusRow
                                    label="Report Engine"
                                    status="Operational"
                                />

                            </div>


                            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-emerald-500/10 p-2">

                                        <CheckCircle2
                                            size={20}
                                            className="text-emerald-400"
                                        />

                                    </div>

                                    <div>

                                        <p className="font-medium text-emerald-300">
                                            All systems operational
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Detection pipeline is ready.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* ==================================================
                        QUICK ACTIONS
                    ================================================== */}

                    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

                        <div>

                            <h2 className="text-xl font-semibold">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Start your next task.
                            </p>

                        </div>


                        <div className="mt-5 grid gap-4 md:grid-cols-3">

                            <QuickAction
                                to="/upload"
                                icon={<UploadCloud size={22} />}
                                title="Analyze Media"
                                description="Upload an image, video, or audio file."
                            />

                            <QuickAction
                                to="/history"
                                icon={<ScanFace size={22} />}
                                title="View History"
                                description="Review previously analyzed media."
                            />

                            <QuickAction
                                to="/reports"
                                icon={<ShieldCheck size={22} />}
                                title="View Reports"
                                description="Access generated analysis reports."
                            />

                        </div>

                    </section>


                    {/* ==================================================
                        SUMMARY
                    ================================================== */}

                    {statistics.total > 0 && (

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">

                            <SummaryCard
                                label="Suspicious"
                                value={statistics.suspicious}
                                color="text-amber-400"
                            />

                            <SummaryCard
                                label="Authentic Rate"
                                value={`${Math.round(
                                    (
                                        statistics.authentic /
                                        statistics.total
                                    ) * 100
                                )}%`}
                                color="text-emerald-400"
                            />

                            <SummaryCard
                                label="Deepfake Rate"
                                value={`${Math.round(
                                    (
                                        statistics.deepfake /
                                        statistics.total
                                    ) * 100
                                )}%`}
                                color="text-rose-400"
                            />

                        </div>

                    )}

                </>

            )}

        </Layout>
    );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    icon,
    description,
    iconClass,
    iconBackground
}) {

    return (

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                        {value}
                    </p>

                </div>


                <div
                    className={`rounded-xl p-3 ${iconBackground} ${iconClass}`}
                >
                    {icon}
                </div>

            </div>

            <p className="mt-4 text-xs text-slate-500">
                {description}
            </p>

        </div>
    );
}


// ============================================================
// RECENT SCAN
// ============================================================

function RecentScan({
    scan
}) {

    const verdict =
        String(
            scan.verdict ||
            scan.result?.verdict ||
            "UNKNOWN"
        ).toUpperCase();

    const media =
        String(
            scan.media ||
            scan.media_type ||
            scan.result?.media ||
            "media"
        ).toLowerCase();

    const filename =
        scan.original_name ||
        scan.filename ||
        scan.result?.original_name ||
        "Unknown file";

    const score =
        scan.score ??
        scan.result?.score ??
        scan.confidence;

    const scanId =
        scan.scan_id ||
        scan._id;

    return (

        <Link
            to={
                scanId
                    ? `/result/${scanId}`
                    : "/history"
            }
            className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
        >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-blue-400">

                {media === "video" ? (
                    <FileVideo size={20} />
                ) : (
                    <ScanFace size={20} />
                )}

            </div>


            <div className="min-w-0 flex-1">

                <p className="truncate font-medium text-slate-200 group-hover:text-blue-400">
                    {filename}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">

                    <span className="capitalize">
                        {media}
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        {score !== undefined
                            ? `${Number(score).toFixed(2)}%`
                            : "No score"}
                    </span>

                </div>

            </div>


            <VerdictBadge
                verdict={verdict}
            />

            <ArrowRight
                size={17}
                className="hidden text-slate-600 transition group-hover:text-blue-400 sm:block"
            />

        </Link>
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

        DEEPFAKE:
            "border-rose-500/20 bg-rose-500/10 text-rose-400",

        SUSPICIOUS:
            "border-amber-500/20 bg-amber-500/10 text-amber-400",

    };

    return (

        <span
            className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                config[verdict] ||
                "border-slate-700 bg-slate-800 text-slate-400"
            }`}
        >
            {verdict}
        </span>
    );
}


// ============================================================
// STATUS
// ============================================================

function StatusRow({
    label,
    status
}) {

    return (

        <div className="flex items-center justify-between rounded-xl bg-slate-950/70 px-4 py-3">

            <span className="text-sm text-slate-400">
                {label}
            </span>

            <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-400">
                    {status}
                </span>

            </div>

        </div>
    );
}


// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
    to,
    icon,
    title,
    description
}) {

    return (

        <Link
            to={to}
            className="group rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-blue-500/30 hover:bg-slate-950/80"
        >

            <div className="flex items-center justify-between">

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                    {icon}
                </div>

                <ArrowRight
                    size={18}
                    className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                />

            </div>

            <h3 className="mt-5 font-semibold text-slate-200">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
            </p>

        </Link>
    );
}


// ============================================================
// SUMMARY
// ============================================================

function SummaryCard({
    label,
    value,
    color
}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

            <p className="text-xs uppercase tracking-wider text-slate-500">
                {label}
            </p>

            <p className={`mt-2 text-2xl font-bold ${color}`}>
                {value}
            </p>

        </div>
    );
}


// ============================================================
// EMPTY
// ============================================================

function EmptyActivity() {

    return (

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 p-10 text-center">

            <ScanFace
                size={32}
                className="mx-auto text-slate-600"
            />

            <p className="mt-4 font-medium text-slate-300">
                No scans yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
                Upload your first media file to begin.
            </p>

            <Link
                to="/upload"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-700"
            >
                <UploadCloud size={17} />
                Start a Scan
            </Link>

        </div>
    );
}


// ============================================================
// LOADING
// ============================================================

function DashboardLoading() {

    return (

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {Array.from({ length: 4 }).map(
                (_, index) => (

                    <div
                        key={index}
                        className="h-36 animate-pulse rounded-3xl border border-slate-800 bg-slate-900"
                    />

                )
            )}

        </div>
    );
}