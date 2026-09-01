import { Link } from "react-router-dom";

import {
    ArrowRight,
    History,
    ScanLine,
    UploadCloud,
} from "lucide-react";


export default function QuickActions() {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center gap-2">

                <ScanLine
                    size={18}
                    className="text-blue-400"
                />

                <h2 className="text-lg font-semibold">
                    Quick Actions
                </h2>

            </div>


            <p className="mt-1 text-xs text-slate-600">
                Start or review an analysis
            </p>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="mt-6 space-y-3">

                {/* NEW SCAN */}

                <Link
                    to="/upload"
                    className="group flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 transition hover:border-blue-500/40 hover:bg-blue-500/15"
                >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/10">

                        <UploadCloud
                            size={19}
                        />

                    </div>


                    <div className="min-w-0 flex-1">

                        <p className="text-sm font-semibold text-slate-100">
                            Scan New Media
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-500">
                            Analyze an image, video, or audio file
                        </p>

                    </div>


                    <ArrowRight
                        size={17}
                        className="shrink-0 text-blue-400 transition-transform group-hover:translate-x-1"
                    />

                </Link>


                {/* HISTORY */}

                <Link
                    to="/history"
                    className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700 hover:bg-slate-950"
                >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-400">

                        <History
                            size={19}
                        />

                    </div>


                    <div className="min-w-0 flex-1">

                        <p className="text-sm font-semibold text-slate-200">
                            View History
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                            Review previous detection results
                        </p>

                    </div>


                    <ArrowRight
                        size={17}
                        className="shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-slate-400"
                    />

                </Link>

            </div>


            {/* ==================================================
                TIP
            ================================================== */}

            <div className="mt-5 border-t border-slate-800 pt-4">

                <div className="flex items-start gap-2">

                    <ScanLine
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-600"
                    />

                    <p className="text-[10px] leading-5 text-slate-600">
                        For best results, upload the original media file whenever possible.
                    </p>

                </div>

            </div>

        </div>
    );
}