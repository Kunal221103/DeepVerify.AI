import { motion } from "framer-motion";

export default function ScanProgress({ progress }) {

    return (

        <div className="mt-8">

            <p className="mb-2">

                AI Analysis

            </p>

            <div className="w-full bg-slate-800 rounded-full h-4">

                <motion.div

                    className="bg-blue-500 h-4 rounded-full"

                    animate={{

                        width: `${progress}%`

                    }}

                />

            </div>

        </div>

    );

}