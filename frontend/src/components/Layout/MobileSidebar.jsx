import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
    Activity,
    FileText,
    History,
    Home,
    Settings,
    ShieldCheck,
    UploadCloud,
    X,
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


export default function MobileSidebar({
    open,
    onClose,
}) {

    return (

        <AnimatePresence>

            {open && (

                <>

                    {/* ==================================================
                        BACKDROP
                    ================================================== */}

                    <motion.button
                        type="button"
                        aria-label="Close navigation"
                        onClick={onClose}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="
                            fixed
                            inset-0
                            z-[60]
                            cursor-default
                            bg-black/60
                            backdrop-blur-[2px]
                            lg:hidden
                        "
                    />


                    {/* ==================================================
                        DRAWER
                    ================================================== */}

                    <motion.aside
                        initial={{
                            x: "-100%",
                        }}
                        animate={{
                            x: 0,
                        }}
                        exit={{
                            x: "-100%",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 30,
                        }}
                        className="
                            fixed
                            inset-y-0
                            left-0
                            z-[70]
                            flex
                            w-[min(18rem,85vw)]
                            flex-col
                            border-r
                            border-slate-800
                            bg-slate-950
                            shadow-2xl
                            lg:hidden
                        "
                    >


                        {/* ==================================================
                            HEADER
                        ================================================== */}

                        <div className="
                            flex
                            h-16
                            shrink-0
                            items-center
                            justify-between
                            border-b
                            border-slate-800
                            px-5
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
                                    border
                                    border-blue-500/20
                                    bg-blue-500/10
                                ">

                                    <ShieldCheck
                                        size={20}
                                        className="text-blue-400"
                                    />

                                </div>


                                <div>

                                    <p className="
                                        font-bold
                                        tracking-tight
                                        text-slate-100
                                    ">

                                        DeepVerify
                                        <span className="text-blue-400">
                                            {" "}AI
                                        </span>

                                    </p>


                                    <p className="
                                        text-[9px]
                                        uppercase
                                        tracking-[0.16em]
                                        text-slate-600
                                    ">
                                        Navigation
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close navigation"
                                className="
                                    rounded-xl
                                    p-2
                                    text-slate-500
                                    transition
                                    hover:bg-slate-900
                                    hover:text-slate-200
                                "
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* ==================================================
                            NAVIGATION
                        ================================================== */}

                        <nav className="
                            flex-1
                            overflow-y-auto
                            p-4
                        ">

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
                                                key={
                                                    item.to
                                                }
                                                to={
                                                    item.to
                                                }
                                                end={
                                                    item.to ===
                                                    "/"
                                                }
                                                onClick={
                                                    onClose
                                                }
                                                className={({
                                                    isActive,
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
                                                `}
                                            >

                                                {({
                                                    isActive,
                                                }) => (

                                                    <>

                                                        {/* ACTIVE INDICATOR */}

                                                        {isActive && (

                                                            <motion.span
                                                                layoutId="mobile-active-nav"
                                                                className="
                                                                    absolute
                                                                    left-0
                                                                    h-6
                                                                    w-0.5
                                                                    rounded-r-full
                                                                    bg-blue-400
                                                                "
                                                            />

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
                                                            {
                                                                item.label
                                                            }
                                                        </span>


                                                        {/* AI BADGE */}

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

                    </motion.aside>

                </>

            )}

        </AnimatePresence>

    );
}