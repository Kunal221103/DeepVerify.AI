import {
    Activity,
    ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";


export default function Navbar() {

    return (

        <header className="
            sticky
            top-0
            z-40
            h-16
            border-b
            border-slate-800
            bg-slate-950/95
            backdrop-blur
        ">

            <div className="
                flex
                h-full
                items-center
                justify-between
                px-5
                sm:px-6
            ">


                {/* ==================================================
                    BRAND
                ================================================== */}

                <Link
                    to="/"
                    className="
                        flex
                        items-center
                        gap-3
                        no-underline
                    "
                >

                    <div className="
                        flex
                        h-9
                        w-9
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

                        <h1 className="
                            text-base
                            font-bold
                            tracking-tight
                            text-slate-100
                        ">
                            DeepVerify AI
                        </h1>


                        <p className="
                            hidden
                            text-[9px]
                            uppercase
                            tracking-[0.16em]
                            text-slate-600
                            sm:block
                        ">
                            Deepfake Detection
                        </p>

                    </div>

                </Link>


                {/* ==================================================
                    STATUS
                ================================================== */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        hidden
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-emerald-500/10
                        bg-emerald-500/5
                        px-3
                        py-2
                        sm:flex
                    ">

                        <Activity
                            size={14}
                            className="text-emerald-400"
                        />


                        <span className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-emerald-400
                        ">
                            System Online
                        </span>

                    </div>

                </div>

            </div>

        </header>

    );
}