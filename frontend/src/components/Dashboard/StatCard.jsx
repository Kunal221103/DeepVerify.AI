import { motion } from "framer-motion";


export default function StatCard({
    title,
    value,
    icon,
    color = "text-blue-400"
}) {

    return (

        <motion.div
            whileHover={{
                y: -3
            }}
            transition={{
                duration: 0.2
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition-colors hover:border-slate-700"
        >

            {/* Subtle background glow */}

            <div
                className={`
                    pointer-events-none absolute
                    -right-10 -top-10 h-28 w-28
                    rounded-full opacity-10 blur-3xl
                    ${color.replace("text-", "bg-")}
                `}
            />


            <div className="relative flex items-start justify-between gap-4">

                {/* Information */}

                <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {title}
                    </p>


                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-100">
                        {value}
                    </h2>

                </div>


                {/* Icon */}

                <div
                    className={`
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl bg-slate-950
                        ${color}
                        transition-transform
                        group-hover:scale-105
                    `}
                >
                    {icon}
                </div>

            </div>


            {/* Bottom indicator */}

            <div className="relative mt-5 flex items-center gap-2">

                <span
                    className={`
                        h-1.5 w-1.5 rounded-full
                        ${color.replace("text-", "bg-")}
                    `}
                />

                <span className="text-[11px] text-slate-600">
                    Recorded in system
                </span>

            </div>

        </motion.div>

    );
}