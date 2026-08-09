import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg"
        >

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-slate-400 text-sm">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div
                    className={`text-4xl ${color}`}
                >
                    {icon}
                </div>

            </div>

        </motion.div>

    );

}