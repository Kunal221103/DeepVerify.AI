import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import StatCard from "../components/Dashboard/StatCard";
import RecentActivity from "../components/Dashboard/RecentActivity";
import SystemStatus from "../components/Dashboard/SystemStatus";
import QuickActions from "../components/Dashboard/QuickActions";

import { Shield, ScanFace, AlertTriangle, FileVideo } from "lucide-react";

import { getHistory } from "../services/historyService";

export default function Home() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getHistory();

                setHistory(Array.isArray(data) ? data : []);

            } catch (error) {

                console.error("Failed to load history:", error);

            } finally {

                setLoading(false);

            }

        }

        loadHistory();

    }, []);

    const totalScans = history.length;

    const authentic = history.filter(
        scan => scan.verdict === "AUTHENTIC"
    ).length;

    const deepfake = history.filter(
        scan =>
            scan.verdict === "DEEPFAKE" ||
            scan.verdict === "AI GENERATED"
    ).length;

    const videos = history.filter(
        scan => scan.media === "video"
    ).length;

    return (

        <Layout>

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-4xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Deepfake detection overview
                    </p>

                </div>

                <Link
                    to="/upload"
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
                >
                    + New Scan
                </Link>

            </div>

            {loading ? (

                <div className="text-slate-400">
                    Loading dashboard...
                </div>

            ) : (

                <>

                    <div className="grid md:grid-cols-4 gap-6">

                        <StatCard
                            title="Total Scans"
                            value={totalScans}
                            icon={<ScanFace />}
                            color="text-blue-400"
                        />

                        <StatCard
                            title="Authentic"
                            value={authentic}
                            icon={<Shield />}
                            color="text-green-400"
                        />

                        <StatCard
                            title="Deepfake"
                            value={deepfake}
                            icon={<AlertTriangle />}
                            color="text-red-400"
                        />

                        <StatCard
                            title="Videos"
                            value={videos}
                            icon={<FileVideo />}
                            color="text-purple-400"
                        />

                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mt-8">

                        <RecentActivity
                            history={history.slice(0, 5)}
                        />

                        <SystemStatus />

                        <QuickActions />

                    </div>

                </>

            )}

        </Layout>

    );
}