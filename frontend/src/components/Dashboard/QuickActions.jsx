import { Link } from "react-router-dom";

export default function QuickActions() {

    return (

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <h2 className="text-xl font-semibold mb-5">

                Quick Actions

            </h2>

            <div className="flex flex-col gap-4">

                <Link
                    to="/upload"
                    className="bg-blue-600 rounded-lg p-3 text-center hover:bg-blue-700"
                >
                    Scan New Media
                </Link>

                <Link
                    to="/history"
                    className="bg-slate-800 rounded-lg p-3 text-center hover:bg-slate-700"
                >
                    View History
                </Link>

            </div>

        </div>

    );

}