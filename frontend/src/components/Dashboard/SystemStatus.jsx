import {
    Activity,
    CheckCircle2,
    Database,
    Server,
    ShieldCheck,
    Sparkles,
    Volume2,
} from "lucide-react";


export default function SystemStatus() {

    const systems = [

        {
            name: "Image AI",
            description: "Image detection engine",
            icon: Sparkles,
        },

        {
            name: "Video AI",
            description: "Frame analysis engine",
            icon: ShieldCheck,
        },

        {
            name: "Audio AI",
            description: "Voice analysis engine",
            icon: Volume2,
        },

        {
            name: "Database",
            description: "Scan history storage",
            icon: Database,
        },

        {
            name: "Backend API",
            description: "Analysis service",
            icon: Server,
        },

    ];


    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <Activity
                            size={18}
                            className="text-blue-400"
                        />

                        <h2 className="text-lg font-semibold">
                            System Status
                        </h2>

                    </div>


                    <p className="mt-1 text-xs text-slate-600">
                        Detection infrastructure
                    </p>

                </div>


                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Operational
                    </span>

                </div>

            </div>


            {/* ==================================================
                SERVICES
            ================================================== */}

            <div className="mt-6 divide-y divide-slate-800">

                {systems.map(
                    (system) => {

                        const Icon =
                            system.icon;


                        return (

                            <div
                                key={system.name}
                                className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
                            >

                                {/* ICON */}

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-slate-500">

                                    <Icon
                                        size={17}
                                    />

                                </div>


                                {/* DESCRIPTION */}

                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-medium text-slate-300">
                                        {system.name}
                                    </p>

                                    <p className="mt-0.5 truncate text-[10px] text-slate-600">
                                        {system.description}
                                    </p>

                                </div>


                                {/* STATUS */}

                                <div className="flex items-center gap-1.5">

                                    <CheckCircle2
                                        size={15}
                                        className="text-emerald-400"
                                    />

                                    <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-emerald-400 sm:block">
                                        Ready
                                    </span>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <p className="text-[10px] text-slate-600">
                    All detection services are available
                </p>

            </div>

        </div>
    );
}