import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
    CheckCircle2,
    FileAudio,
    FileImage,
    FileVideo,
    Loader2,
    ScanLine,
    ShieldCheck,
    UploadCloud,
} from "lucide-react";

import Layout from "../components/Layout/Layout";
import UploadBox from "../components/UploadBox";
import api from "../services/api";


export default function Upload() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);


    // ==========================================================
    // SCAN MEDIA
    // ==========================================================

    const scanMedia = async () => {

        if (!file) {

            alert("Please select a file.");

            return;
        }


        try {

            setLoading(true);


            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );


            const response =
                await api.post(
                    "/scan",
                    formData
                );


            navigate(
                "/result",
                {
                    state: response.data
                }
            );


        } catch (error) {

            console.error(
                "Scan failed:",
                error
            );


            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "Scan failed. Please try again.";


            alert(message);


        } finally {

            setLoading(false);

        }

    };


    // ==========================================================
    // ANALYSIS SCREEN
    // ==========================================================

    if (loading) {

        return (

            <Layout>

                <AnalysisAnimation
                    file={file}
                />

            </Layout>

        );

    }


    // ==========================================================
    // UPLOAD SCREEN
    // ==========================================================

    return (

        <Layout>

            <div className="mx-auto max-w-5xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-blue-400
                    ">

                        <UploadCloud
                            size={16}
                        />

                        Media Analysis

                    </div>


                    <h1 className="
                        mt-2
                        text-3xl
                        font-bold
                        tracking-tight
                        sm:text-4xl
                    ">
                        Upload Media
                    </h1>


                    <p className="
                        mt-2
                        max-w-2xl
                        text-sm
                        leading-6
                        text-slate-500
                    ">
                        Upload an image, video, or audio file
                        for AI-powered authenticity analysis.
                    </p>

                </div>


                {/* ==================================================
                    UPLOAD CARD
                ================================================== */}

                <section className="
                    rounded-3xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-5
                    shadow-lg
                    sm:p-6
                ">

                    <UploadBox
                        onFileSelect={
                            setFile
                        }
                    />


                    {/* ==================================================
                        SELECTED FILE
                    ================================================== */}

                    {file && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.3
                            }}
                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-950
                                p-4
                            "
                        >

                            <div className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            ">


                                {/* FILE INFO */}

                                <div className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                ">

                                    <div className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-500/10
                                    ">

                                        <SelectedFileIcon
                                            file={file}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-slate-200
                                        ">
                                            {file.name}
                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-600
                                        ">
                                            {formatFileSize(
                                                file.size
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* SCAN BUTTON */}

                                <button
                                    type="button"
                                    onClick={
                                        scanMedia
                                    }
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-blue-600/10
                                        transition-all
                                        duration-200
                                        hover:bg-blue-700
                                        hover:shadow-blue-600/20
                                    "
                                >

                                    <ScanLine
                                        size={17}
                                    />

                                    Scan with AI

                                </button>

                            </div>

                        </motion.div>

                    )}

                </section>


                {/* ==================================================
                    INFO CARDS
                ================================================== */}

                <div className="
                    mt-6
                    grid
                    gap-4
                    sm:grid-cols-3
                ">

                    <InfoCard
                        icon={
                            <FileImage
                                size={18}
                            />
                        }
                        title="Image"
                        description="AI image authenticity analysis"
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />


                    <InfoCard
                        icon={
                            <FileVideo
                                size={18}
                            />
                        }
                        title="Video"
                        description="Frame and deepfake analysis"
                        color="text-violet-400"
                        bg="bg-violet-500/10"
                    />


                    <InfoCard
                        icon={
                            <FileAudio
                                size={18}
                            />
                        }
                        title="Audio"
                        description="Synthetic audio detection"
                        color="text-amber-400"
                        bg="bg-amber-500/10"
                    />

                </div>


                {/* ==================================================
                    TRUST NOTICE
                ================================================== */}

                <div className="
                    mt-6
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/60
                    p-4
                ">

                    <ShieldCheck
                        size={18}
                        className="
                            mt-0.5
                            shrink-0
                            text-emerald-400
                        "
                    />


                    <div>

                        <p className="
                            text-xs
                            font-medium
                            text-slate-300
                        ">
                            Analysis pipeline
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            leading-5
                            text-slate-600
                        ">
                            Your selected media is sent to the
                            DeepVerify analysis engine for processing.
                            The final assessment is generated from
                            the backend detection pipeline.
                        </p>

                    </div>

                </div>

            </div>

        </Layout>

    );
}


// ============================================================
// ANALYSIS ANIMATION
// ============================================================

function AnalysisAnimation({
    file
}) {

    const [activeStage, setActiveStage] =
        useState(0);


    const stages = [

        {
            title: "Preparing media",
            description:
                "Validating the uploaded file and preparing it for analysis.",
            icon: UploadCloud,
        },

        {
            title: "Analyzing visual signals",
            description:
                "Examining visual patterns and manipulation indicators.",
            icon: FileImage,
        },

        {
            title: "Analyzing audio signals",
            description:
                "Checking audio characteristics for synthetic or manipulated content.",
            icon: FileAudio,
        },

        {
            title: "Cross-checking evidence",
            description:
                "Combining available signals to improve detection reliability.",
            icon: ShieldCheck,
        },

        {
            title: "Preparing final assessment",
            description:
                "Finalizing the analysis and preparing your result.",
            icon: ScanLine,
        },

    ];


    const current =
        stages[
            activeStage
        ];


    const CurrentIcon =
        current.icon;


    const progress =
        Math.round(
            ((activeStage + 1) /
                stages.length) *
            100
        );


    // ==========================================================
    // STAGE TIMER
    // ==========================================================

    useEffect(() => {

        const timer =
            setInterval(() => {

                setActiveStage(
                    (previous) => {

                        if (
                            previous >=
                            stages.length - 1
                        ) {

                            return previous;

                        }

                        return previous + 1;

                    }
                );

            }, 3500);


        return () =>
            clearInterval(timer);

    }, []);


    return (

        <div className="
            mx-auto
            flex
            min-h-[calc(100vh-10rem)]
            max-w-4xl
            items-center
            justify-center
        ">

            <div className="
                w-full
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                p-6
                shadow-2xl
                sm:p-10
            ">


                {/* ==================================================
                    TOP STATUS
                ================================================== */}

                <div className="
                    flex
                    items-center
                    justify-center
                    gap-2
                ">

                    <span className="
                        h-2
                        w-2
                        animate-pulse
                        rounded-full
                        bg-blue-400
                    " />


                    <span className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-blue-400
                    ">
                        AI Analysis Running
                    </span>

                </div>


                {/* ==================================================
                    SCANNER
                ================================================== */}

                <div className="
                    relative
                    mx-auto
                    mt-8
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center
                ">


                    {/* Outer pulse */}

                    <motion.div
                        animate={{
                            scale: [
                                1,
                                1.15,
                                1
                            ],
                            opacity: [
                                0.25,
                                0.05,
                                0.25
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="
                            absolute
                            inset-0
                            rounded-full
                            border
                            border-blue-500/20
                        "
                    />


                    {/* Rotating ring */}

                    <motion.div
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="
                            absolute
                            inset-3
                            rounded-full
                            border
                            border-dashed
                            border-blue-500/30
                        "
                    />


                    {/* Scanner line */}

                    <motion.div
                        animate={{
                            y: [
                                -25,
                                25,
                                -25
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="
                            absolute
                            left-5
                            right-5
                            h-px
                            bg-blue-400/60
                            shadow-[0_0_12px_rgba(59,130,246,0.6)]
                        "
                    />


                    {/* Icon */}

                    <div className="
                        relative
                        z-10
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-500/10
                        text-blue-400
                    ">

                        <AnimatePresence
                            mode="wait"
                        >

                            <motion.div
                                key={activeStage}
                                initial={{
                                    opacity: 0,
                                    scale: 0.7,
                                    rotate: -15
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.7,
                                    rotate: 15
                                }}
                                transition={{
                                    duration: 0.35
                                }}
                            >

                                <CurrentIcon
                                    size={30}
                                />

                            </motion.div>

                        </AnimatePresence>

                    </div>

                </div>


                {/* ==================================================
                    CURRENT STAGE
                ================================================== */}

                <div className="
                    mt-3
                    min-h-[105px]
                    text-center
                ">

                    <p className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-slate-600
                    ">
                        Processing
                    </p>


                    <AnimatePresence
                        mode="wait"
                    >

                        <motion.div
                            key={activeStage}
                            initial={{
                                opacity: 0,
                                y: 10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                y: -10
                            }}
                            transition={{
                                duration: 0.35,
                                ease: "easeOut"
                            }}
                        >

                            <h1 className="
                                mt-2
                                text-2xl
                                font-bold
                                text-slate-100
                                sm:text-3xl
                            ">
                                {current.title}
                            </h1>


                            <p className="
                                mx-auto
                                mt-2
                                max-w-lg
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                {current.description}
                            </p>

                        </motion.div>

                    </AnimatePresence>

                </div>


                {/* ==================================================
                    FILE NAME
                ================================================== */}

                {file && (

                    <div className="
                        mx-auto
                        mt-4
                        flex
                        max-w-md
                        items-center
                        justify-center
                        gap-2
                        text-xs
                        text-slate-600
                    ">

                        <Loader2
                            size={13}
                            className="animate-spin"
                        />

                        <span className="truncate">
                            {file.name}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="
                    mx-auto
                    mt-8
                    max-w-xl
                ">

                    <div className="
                        mb-2
                        flex
                        items-center
                        justify-between
                    ">

                        <span className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-600
                        ">
                            Analysis progress
                        </span>


                        <span className="
                            text-xs
                            font-semibold
                            tabular-nums
                            text-blue-400
                        ">
                            {progress}%
                        </span>

                    </div>


                    <div className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-slate-800
                    ">

                        <motion.div
                            initial={{
                                width: 0
                            }}
                            animate={{
                                width: `${progress}%`
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                            className="
                                h-full
                                rounded-full
                                bg-blue-500
                            "
                        />

                    </div>

                </div>


                {/* ==================================================
                    STAGE LIST
                ================================================== */}

                <div className="
                    mx-auto
                    mt-8
                    max-w-xl
                    space-y-2
                ">

                    {stages.map(
                        (
                            stage,
                            index
                        ) => {

                            const Icon =
                                stage.icon;


                            const isCompleted =
                                index <
                                activeStage;


                            const isActive =
                                index ===
                                activeStage;


                            const isPending =
                                index >
                                activeStage;


                            return (

                                <motion.div
                                    key={
                                        stage.title
                                    }
                                    layout
                                    initial={{
                                        opacity: 0,
                                        x: -10
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay:
                                            index *
                                            0.05
                                    }}
                                    className={`
                                        relative
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        px-4
                                        py-3
                                        transition-all
                                        duration-300

                                        ${
                                            isActive
                                                ? `
                                                    border-blue-500/20
                                                    bg-blue-500/5
                                                `
                                                : isCompleted
                                                    ? `
                                                        border-emerald-500/10
                                                        bg-emerald-500/[0.03]
                                                    `
                                                    : `
                                                        border-slate-800
                                                        bg-slate-950/40
                                                    `
                                        }
                                    `}
                                >

                                    {/* ==================================================
                                        STATUS ICON
                                    ================================================== */}

                                    <div className="
                                        relative
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                    ">


                                        {/* COMPLETED */}

                                        {isCompleted && (

                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    rotate: -45
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    rotate: 0
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 20
                                                }}
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-emerald-500/10
                                                    text-emerald-400
                                                "
                                            >

                                                <CheckCircle2
                                                    size={18}
                                                />

                                            </motion.div>

                                        )}


                                        {/* ACTIVE */}

                                        {isActive && (

                                            <motion.div
                                                animate={{
                                                    scale: [
                                                        1,
                                                        1.08,
                                                        1
                                                    ]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-blue-500/10
                                                    text-blue-400
                                                "
                                            >

                                                <Icon
                                                    size={18}
                                                />

                                            </motion.div>

                                        )}


                                        {/* PENDING */}

                                        {isPending && (

                                            <div className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-slate-800/60
                                                text-slate-600
                                            ">

                                                <Icon
                                                    size={17}
                                                />

                                            </div>

                                        )}

                                    </div>


                                    {/* ==================================================
                                        TEXT
                                    ================================================== */}

                                    <div className="
                                        min-w-0
                                        flex-1
                                    ">

                                        <p
                                            className={`
                                                text-sm
                                                font-medium
                                                transition-colors
                                                ${
                                                    isActive
                                                        ? "text-blue-300"
                                                        : isCompleted
                                                            ? "text-slate-300"
                                                            : "text-slate-600"
                                                }
                                            `}
                                        >
                                            {stage.title}
                                        </p>


                                        <p
                                            className={`
                                                mt-0.5
                                                text-[10px]
                                                transition-colors
                                                ${
                                                    isActive
                                                        ? "text-slate-500"
                                                        : "text-slate-700"
                                                }
                                            `}
                                        >

                                            {isActive
                                                ? "Currently processing..."
                                                : isCompleted
                                                    ? "Completed"
                                                    : "Waiting"
                                            }

                                        </p>

                                    </div>


                                    {/* ==================================================
                                        STATUS TEXT
                                    ================================================== */}

                                    <div className="
                                        shrink-0
                                    ">

                                        {isCompleted && (

                                            <span className="
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-emerald-400
                                            ">
                                                Done
                                            </span>

                                        )}


                                        {isActive && (

                                            <div className="
                                                flex
                                                items-center
                                                gap-1.5
                                            ">

                                                <span className="
                                                    h-1.5
                                                    w-1.5
                                                    animate-pulse
                                                    rounded-full
                                                    bg-blue-400
                                                " />


                                                <span className="
                                                    text-[9px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-wider
                                                    text-blue-400
                                                ">
                                                    Running
                                                </span>

                                            </div>

                                        )}


                                        {isPending && (

                                            <span className="
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-700
                                            ">
                                                Pending
                                            </span>

                                        )}

                                    </div>

                                </motion.div>

                            );

                        }
                    )}

                </div>


                {/* ==================================================
                    FOOTER MESSAGE
                ================================================== */}

                <div className="
                    mt-8
                    text-center
                ">

                    <p className="
                        text-[10px]
                        leading-5
                        text-slate-700
                    ">
                        Please keep this page open while
                        DeepVerify completes the analysis.
                    </p>

                </div>

            </div>

        </div>

    );
}


// ============================================================
// SELECTED FILE ICON
// ============================================================

function SelectedFileIcon({
    file
}) {

    const type =
        String(
            file?.type || ""
        ).toLowerCase();


    if (type.startsWith("video/")) {

        return (

            <FileVideo
                size={20}
                className="text-violet-400"
            />

        );

    }


    if (type.startsWith("audio/")) {

        return (

            <FileAudio
                size={20}
                className="text-amber-400"
            />

        );

    }


    return (

        <FileImage
            size={20}
            className="text-blue-400"
        />

    );
}


// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
    icon,
    title,
    description,
    color,
    bg
}) {

    return (

        <div className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
        ">

            <div className="
                flex
                items-center
                gap-3
            ">

                <div className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    ${bg}
                    ${color}
                `}>
                    {icon}
                </div>


                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-slate-300
                    ">
                        {title}
                    </p>


                    <p className="
                        mt-0.5
                        text-[10px]
                        leading-4
                        text-slate-600
                    ">
                        {description}
                    </p>

                </div>

            </div>

        </div>

    );
}


// ============================================================
// FILE SIZE
// ============================================================

function formatFileSize(
    bytes
) {

    if (
        !bytes ||
        bytes <= 0
    ) {

        return "Unknown size";

    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );


    const size =
        bytes /
        Math.pow(
            1024,
            index
        );


    return `${size.toFixed(
        index === 0 ? 0 : 1
    )} ${units[index]}`;
}