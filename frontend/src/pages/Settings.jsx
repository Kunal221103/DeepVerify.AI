import {
    CheckCircle2,
    Database,
    Info,
    MonitorCog,
    RefreshCw,
    ShieldCheck,
    SlidersHorizontal,
} from "lucide-react";

import Layout from "../components/Layout/Layout";


export default function Settings() {

    const backendUrl =
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000/api";


    return (

        <Layout>

            <div className="mx-auto max-w-7xl">

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

                        <SlidersHorizontal
                            size={16}
                        />

                        Configuration

                    </div>


                    <h1 className="
                        mt-2
                        text-3xl
                        font-bold
                        tracking-tight
                        sm:text-4xl
                    ">
                        Settings
                    </h1>


                    <p className="
                        mt-2
                        max-w-2xl
                        text-sm
                        leading-6
                        text-slate-500
                    ">
                        View DeepVerify system configuration and
                        detection capabilities.
                    </p>

                </div>


                {/* ==================================================
                    SETTINGS GRID
                ================================================== */}

                <div className="
                    grid
                    gap-6
                    xl:grid-cols-2
                ">


                    {/* ==================================================
                        DETECTION ENGINE
                    ================================================== */}

                    <SettingsCard
                        icon={
                            <ShieldCheck
                                size={21}
                            />
                        }
                        iconColor="text-blue-400"
                        iconBg="bg-blue-500/10"
                        title="Detection Engine"
                        description="DeepVerify analysis capabilities."
                    >

                        <SettingRow
                            label="Image Detection"
                            value="Enabled"
                            active
                        />

                        <SettingRow
                            label="Video Detection"
                            value="Enabled"
                            active
                        />

                        <SettingRow
                            label="Audio Detection"
                            value="Enabled"
                            active
                        />

                        <SettingRow
                            label="Lip-Sync Analysis"
                            value="Enabled"
                            active
                        />

                        <SettingRow
                            label="Metadata Analysis"
                            value="Enabled"
                            active
                        />

                    </SettingsCard>


                    {/* ==================================================
                        SYSTEM
                    ================================================== */}

                    <SettingsCard
                        icon={
                            <MonitorCog
                                size={21}
                            />
                        }
                        iconColor="text-violet-400"
                        iconBg="bg-violet-500/10"
                        title="System"
                        description="Application and backend services."
                    >

                        <SettingRow
                            label="Frontend"
                            value="Operational"
                            active
                        />

                        <SettingRow
                            label="Backend API"
                            value="Connected"
                            active
                        />

                        <SettingRow
                            label="Report Engine"
                            value="Available"
                            active
                        />

                        <SettingRow
                            label="History Service"
                            value="Available"
                            active
                        />

                    </SettingsCard>


                    {/* ==================================================
                        API CONFIGURATION
                    ================================================== */}

                    <SettingsCard
                        icon={
                            <Database
                                size={21}
                            />
                        }
                        iconColor="text-emerald-400"
                        iconBg="bg-emerald-500/10"
                        title="API Configuration"
                        description="Current application API endpoint."
                    >

                        <div className="
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-950
                            p-4
                        ">

                            <p className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-slate-600
                            ">
                                API Base URL
                            </p>


                            <p className="
                                mt-2
                                break-all
                                font-mono
                                text-sm
                                text-slate-300
                            ">
                                {backendUrl}
                            </p>

                        </div>


                        <div className="
                            mt-4
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-blue-500/10
                            bg-blue-500/5
                            p-4
                        ">

                            <Info
                                size={17}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-blue-400
                                "
                            />


                            <p className="
                                text-xs
                                leading-5
                                text-slate-500
                            ">
                                The API endpoint is controlled through
                                the VITE_API_URL environment variable.
                            </p>

                        </div>

                    </SettingsCard>


                    {/* ==================================================
                        APPLICATION
                    ================================================== */}

                    <SettingsCard
                        icon={
                            <RefreshCw
                                size={21}
                            />
                        }
                        iconColor="text-amber-400"
                        iconBg="bg-amber-500/10"
                        title="Application"
                        description="DeepVerify application information."
                    >

                        <SettingRow
                            label="Application"
                            value="DeepVerify AI"
                        />

                        <SettingRow
                            label="Detection Platform"
                            value="DeepVerify Engine"
                        />

                        <SettingRow
                            label="Interface"
                            value="Web Application"
                        />

                        <SettingRow
                            label="Environment"
                            value="Local"
                        />

                    </SettingsCard>

                </div>


                {/* ==================================================
                    PRIVACY
                ================================================== */}

                <section className="
                    mt-6
                    rounded-3xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-6
                    shadow-lg
                ">

                    <div className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-500/10
                        ">

                            <ShieldCheck
                                size={23}
                                className="text-blue-400"
                            />

                        </div>


                        <div className="flex-1">

                            <h2 className="
                                font-semibold
                                text-slate-200
                            ">
                                Media Privacy
                            </h2>


                            <p className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                Uploaded media is processed by the
                                DeepVerify analysis pipeline. Avoid
                                uploading sensitive material unless
                                you are authorized to process it.
                            </p>

                        </div>


                        <div className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-emerald-500/10
                            bg-emerald-500/5
                            px-3
                            py-2
                        ">

                            <CheckCircle2
                                size={15}
                                className="text-emerald-400"
                            />

                            <span className="
                                text-xs
                                font-medium
                                text-emerald-400
                            ">
                                Protected
                            </span>

                        </div>

                    </div>

                </section>

            </div>

        </Layout>
    );
}


// ============================================================
// SETTINGS CARD
// ============================================================

function SettingsCard({
    icon,
    iconColor,
    iconBg,
    title,
    description,
    children
}) {

    return (

        <section className="
            rounded-3xl
            border
            border-slate-800
            bg-slate-900
            p-6
            shadow-lg
            transition-all
            duration-300
            hover:border-slate-700
        ">

            <div className="
                flex
                items-start
                gap-4
            ">

                <div className={`
                    rounded-xl
                    p-3
                    ${iconBg}
                    ${iconColor}
                `}>
                    {icon}
                </div>


                <div>

                    <h2 className="
                        text-xl
                        font-semibold
                        text-slate-100
                    ">
                        {title}
                    </h2>


                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">
                        {description}
                    </p>

                </div>

            </div>


            <div className="
                mt-6
                space-y-3
            ">
                {children}
            </div>

        </section>
    );
}


// ============================================================
// SETTING ROW
// ============================================================

function SettingRow({
    label,
    value,
    active = false
}) {

    return (

        <div className="
            flex
            items-center
            justify-between
            gap-4
            rounded-xl
            border
            border-transparent
            bg-slate-950/70
            px-4
            py-3
            transition
            hover:border-slate-800
        ">

            <span className="
                text-sm
                text-slate-400
            ">
                {label}
            </span>


            <div className="
                flex
                items-center
                gap-2
            ">

                {active && (

                    <span className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-emerald-400
                    " />

                )}


                <span
                    className={
                        active
                            ? "text-xs font-medium text-emerald-400"
                            : "text-xs text-slate-400"
                    }
                >
                    {value}
                </span>

            </div>

        </div>

    );
}