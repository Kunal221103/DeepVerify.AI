import { NavLink } from "react-router-dom";

import {
    Activity,
    FileText,
    History,
    Home,
    Settings,
    ShieldCheck,
    UploadCloud,
} from "lucide-react";


const navigation = [
    {
        to: "/",
        label: "Dashboard",
        icon: Home,
    },
    {
        to: "/upload",
        label: "New Scan",
        icon: UploadCloud,
    },
    {
        to: "/history",
        label: "History",
        icon: History,
    },
    {
        to: "/reports",
        label: "Reports",
        icon: FileText,
    },
    {
        to: "/settings",
        label: "Settings",
        icon: Settings,
    },
];


export default function Sidebar() {

    return (

        <aside
            className="
                hidden
                w-64
                shrink-0
                border-r
                border-slate-800
                bg-slate-950
                lg:block
            "
        >

            <div className="
                sticky
                top-16
                flex
                h-[calc(100vh-4rem)]
                flex-col
            ">


                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav className="flex-1 p-4">

                    <p className="
                        px-3
                        pb-3
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-slate-600
                    ">
                        Workspace
                    </p>


                    <div className="space-y-1">

                        {navigation.map(
                            (item) => {

                                const Icon =
                                    item.icon;


                                return (

                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={
                                            item.to === "/"
                                        }
                                        className={({
                                            isActive
                                        }) => `
                                            group
                                            relative
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-3
                                            text-sm
                                            font-medium
                                            transition-all
                                            duration-200

                                            ${
                                                isActive
                                                    ? `
                                                        bg-blue-500/10
                                                        text-blue-400
                                                    `
                                                    : `
                                                        text-slate-400
                                                        hover:bg-slate-900
                                                        hover:text-slate-200
                                                    `
                                            }
                                        `
                                        }
                                    >

                                        {({
                                            isActive
                                        }) => (

                                            <>

                                                {/* Active indicator */}

                                                {isActive && (

                                                    <span className="
                                                        absolute
                                                        left-0
                                                        h-6
                                                        w-0.5
                                                        rounded-r-full
                                                        bg-blue-400
                                                    " />

                                                )}


                                                <Icon
                                                    size={19}
                                                    strokeWidth={
                                                        isActive
                                                            ? 2.2
                                                            : 1.9
                                                    }
                                                    className={
                                                        isActive
                                                            ? "text-blue-400"
                                                            : `
                                                                text-slate-500
                                                                transition-colors
                                                                group-hover:text-slate-300
                                                            `
                                                    }
                                                />


                                                <span>
                                                    {item.label}
                                                </span>


                                                {/* New scan indicator */}

                                                {item.to ===
                                                    "/upload" && (

                                                    <span className="
                                                        ml-auto
                                                        rounded-md
                                                        border
                                                        border-blue-500/20
                                                        bg-blue-500/5
                                                        px-1.5
                                                        py-0.5
                                                        text-[8px]
                                                        font-bold
                                                        uppercase
                                                        tracking-wider
                                                        text-blue-400
                                                    ">
                                                        AI
                                                    </span>

                                                )}

                                            </>

                                        )}

                                    </NavLink>

                                );

                            }
                        )}

                    </div>

                </nav>


                {/* ==================================================
                    ENGINE STATUS
                ================================================== */}

                <div className="p-4">

                    <div className="
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-900/60
                        p-4
                    ">


                        <div className="
                            flex
                            items-center
                            gap-3
                        ">


                            <div className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-500/10
                            ">

                                <ShieldCheck
                                    size={18}
                                    className="text-blue-400"
                                />

                            </div>


                            <div className="min-w-0">

                                <p className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-200
                                ">
                                    DeepVerify Engine
                                </p>


                                <div className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <span className="
                                        relative
                                        flex
                                        h-1.5
                                        w-1.5
                                    ">

                                        <span className="
                                            absolute
                                            inline-flex
                                            h-full
                                            w-full
                                            animate-ping
                                            rounded-full
                                            bg-emerald-400
                                            opacity-50
                                        " />

                                        <span className="
                                            relative
                                            inline-flex
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-emerald-400
                                        " />

                                    </span>


                                    <span className="
                                        text-xs
                                        text-emerald-400
                                    ">
                                        Operational
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Status details */}

                        <div className="
                            mt-4
                            border-t
                            border-slate-800
                            pt-3
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <Activity
                                        size={13}
                                        className="text-slate-600"
                                    />

                                    <span className="
                                        text-[10px]
                                        text-slate-600
                                    ">
                                        Detection services
                                    </span>

                                </div>


                                <span className="
                                    text-[10px]
                                    font-medium
                                    text-emerald-400
                                ">
                                    ONLINE
                                </span>

                            </div>

                        </div>

                    </div>


                    <p className="
                        mt-3
                        px-1
                        text-[9px]
                        leading-4
                        text-slate-700
                    ">
                        DeepVerify AI · Local Detection Platform
                    </p>

                </div>

            </div>

        </aside>

    );
}