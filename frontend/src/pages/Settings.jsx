import { useState } from "react";

import Layout from "../components/Layout/Layout";

export default function Settings() {

    const [settings, setSettings] = useState({
        autoScan: true,
        saveHistory: true,
        notifications: true,
    });

    const toggleSetting = (key) => {

        setSettings((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));

    };

    return (

        <Layout>

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Settings
                </h1>

                <p className="text-slate-400 mt-2">
                    Manage your DeepVerify AI preferences.
                </p>

            </div>

            <div className="max-w-3xl space-y-6">

                {/* Detection */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <h2 className="text-xl font-semibold">
                        Detection
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                        Configure how media scans are handled.
                    </p>

                    <div className="mt-6">

                        <SettingRow
                            title="Automatic Analysis"
                            description="Automatically start AI analysis after a file is uploaded."
                            enabled={settings.autoScan}
                            onToggle={() =>
                                toggleSetting("autoScan")
                            }
                        />

                    </div>

                </section>

                {/* Storage */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <h2 className="text-xl font-semibold">
                        Storage
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                        Control how scan information is stored.
                    </p>

                    <div className="mt-6">

                        <SettingRow
                            title="Save Scan History"
                            description="Keep completed scans available in the History section."
                            enabled={settings.saveHistory}
                            onToggle={() =>
                                toggleSetting("saveHistory")
                            }
                        />

                    </div>

                </section>

                {/* Notifications */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <h2 className="text-xl font-semibold">
                        Notifications
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                        Configure application notifications.
                    </p>

                    <div className="mt-6">

                        <SettingRow
                            title="Scan Notifications"
                            description="Show notifications when a scan finishes."
                            enabled={settings.notifications}
                            onToggle={() =>
                                toggleSetting("notifications")
                            }
                        />

                    </div>

                </section>

                {/* System */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <h2 className="text-xl font-semibold">
                        System Information
                    </h2>

                    <div className="mt-5 space-y-3 text-sm">

                        <InfoRow
                            label="Application"
                            value="DeepVerify AI"
                        />

                        <InfoRow
                            label="Version"
                            value="1.0.0"
                        />

                        <InfoRow
                            label="AI Engine"
                            value="Vision Transformer"
                        />

                        <InfoRow
                            label="Backend"
                            value="FastAPI"
                        />

                        <InfoRow
                            label="Database"
                            value="MongoDB"
                        />

                    </div>

                </section>

            </div>

        </Layout>

    );
}


function SettingRow({
    title,
    description,
    enabled,
    onToggle
}) {

    return (

        <div className="flex items-center justify-between gap-6">

            <div>

                <h3 className="font-medium">
                    {title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                    {description}
                </p>

            </div>

            <button
                type="button"
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition ${
                    enabled
                        ? "bg-blue-600"
                        : "bg-slate-700"
                }`}
                aria-label={`Toggle ${title}`}
            >

                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                        enabled
                            ? "left-7"
                            : "left-1"
                    }`}
                />

            </button>

        </div>

    );
}


function InfoRow({ label, value }) {

    return (

        <div className="flex justify-between border-b border-slate-800 pb-3">

            <span className="text-slate-400">
                {label}
            </span>

            <span>
                {value}
            </span>

        </div>

    );
}