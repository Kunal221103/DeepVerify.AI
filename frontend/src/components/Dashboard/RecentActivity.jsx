import { Link } from "react-router-dom";

import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileAudio,
    FileImage,
    FileVideo,
    History,
    ShieldQuestion,
} from "lucide-react";


export default function RecentActivity({
    history = []
}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between gap-4">

                <div>

                    <div className="flex items-center gap-2">

                        <History
                            size={18}
                            className="text-blue-400"
                        />

                        <h2 className="text-lg font-semibold">
                            Recent Activity
                        </h2>

                    </div>

                    <p className="mt-1 text-xs text-slate-600">
                        Latest media analyses
                    </p>

                </div>


                <Link
                    to="/history"
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                >

                    View all

                    <ArrowRight
                        size={14}
                    />

                </Link>

            </div>


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {history.length === 0 ? (

                <div className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-5 py-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">

                        <Clock3
                            size={21}
                            className="text-slate-600"
                        />

                    </div>


                    <p className="mt-4 text-sm font-medium text-slate-400">
                        No scans yet
                    </p>


                    <p className="mt-1 text-xs text-slate-600">
                        Your recent analyses will appear here.
                    </p>

                </div>

            ) : (

                /* ==================================================
                   ACTIVITY LIST
                ================================================== */

                <div className="mt-5 divide-y divide-slate-800">

                    {history.map(
                        (scan, index) => {

                            const verdict =
                                normalizeVerdict(
                                    scan.verdict
                                );


                            const config =
                                getVerdictConfig(
                                    verdict
                                );


                            const MediaIcon =
                                getMediaIcon(
                                    scan.media ||
                                    scan.media_type
                                );


                            const id =
                                scan.scan_id ||
                                scan._id;


                            return (

                                <div
                                    key={
                                        id ||
                                        index
                                    }
                                    className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                                >

                                    {/* MEDIA ICON */}

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-slate-500 transition group-hover:text-slate-300">

                                        <MediaIcon
                                            size={18}
                                        />

                                    </div>


                                    {/* FILE INFORMATION */}

                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm font-medium text-slate-200">

                                            {scan.original_name ||
                                                scan.filename ||
                                                "Unknown file"}

                                        </p>


                                        <div className="mt-1 flex items-center gap-2">

                                            <span className="text-[10px] uppercase tracking-wider text-slate-600">

                                                {scan.media ||
                                                    scan.media_type ||
                                                    "media"}

                                            </span>


                                            {scan.score !== undefined && (

                                                <>

                                                    <span className="text-slate-800">
                                                        •
                                                    </span>

                                                    <span className="text-[10px] text-slate-600">
                                                        Score{" "}
                                                        {Number(
                                                            scan.score
                                                        ).toFixed(2)}%
                                                    </span>

                                                </>

                                            )}

                                        </div>

                                    </div>


                                    {/* VERDICT */}

                                    <div
                                        className={`
                                            hidden shrink-0 items-center
                                            gap-1.5 rounded-lg border
                                            px-2.5 py-1.5
                                            text-[10px] font-bold
                                            sm:flex
                                            ${config.border}
                                            ${config.background}
                                            ${config.color}
                                        `}
                                    >

                                        <config.icon
                                            size={13}
                                        />

                                        {config.label}

                                    </div>


                                    {/* MOBILE VERDICT */}

                                    <div
                                        className={`
                                            h-2 w-2 shrink-0 rounded-full
                                            sm:hidden
                                            ${config.dot}
                                        `}
                                    />

                                </div>

                            );

                        }
                    )}

                </div>

            )}

        </div>
    );
}


// ============================================================
// VERDICT CONFIG
// ============================================================

function getVerdictConfig(
    verdict
) {

    if (verdict === "AUTHENTIC") {

        return {

            label: "AUTHENTIC",

            color:
                "text-emerald-400",

            border:
                "border-emerald-500/20",

            background:
                "bg-emerald-500/5",

            dot:
                "bg-emerald-400",

            icon:
                CheckCircle2,

        };
    }


    if (verdict === "DEEPFAKE") {

        return {

            label: "DEEPFAKE",

            color:
                "text-rose-400",

            border:
                "border-rose-500/20",

            background:
                "bg-rose-500/5",

            dot:
                "bg-rose-400",

            icon:
                AlertTriangle,

        };
    }


    return {

        label:
            verdict || "UNKNOWN",

        color:
            "text-amber-400",

        border:
            "border-amber-500/20",

        background:
            "bg-amber-500/5",

        dot:
            "bg-amber-400",

        icon:
            ShieldQuestion,

    };
}


// ============================================================
// NORMALIZE VERDICT
// ============================================================

function normalizeVerdict(
    value
) {

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


// ============================================================
// MEDIA ICON
// ============================================================

function getMediaIcon(
    media
) {

    const type =
        String(
            media ||
            ""
        ).toLowerCase();


    if (type === "video") {
        return FileVideo;
    }


    if (type === "audio") {
        return FileAudio;
    }


    if (type === "image") {
        return FileImage;
    }


    return FileImage;
}