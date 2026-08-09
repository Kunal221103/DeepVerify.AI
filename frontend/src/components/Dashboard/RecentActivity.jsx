export default function RecentActivity({ history = [] }) {

    return (

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <h2 className="text-xl font-semibold mb-5">
                Recent Activity
            </h2>

            {history.length === 0 ? (

                <p className="text-slate-400">
                    No scans yet.
                </p>

            ) : (

                <div className="space-y-4">

                    {history.map((scan, index) => {

                        const color =
                            scan.verdict === "AUTHENTIC"
                                ? "text-green-400"
                                : scan.verdict === "DEEPFAKE" ||
                                  scan.verdict === "AI GENERATED"
                                ? "text-red-400"
                                : "text-yellow-400";

                        return (

                            <div
                                key={scan.scan_id || scan._id || index}
                                className="flex justify-between items-center border-b border-slate-800 pb-3"
                            >

                                <div>

                                    <p className="font-medium">
                                        {scan.original_name ||
                                            scan.filename ||
                                            "Unknown file"}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {scan.media || "media"}
                                    </p>

                                </div>

                                <span className={color}>
                                    {scan.verdict || "UNKNOWN"}
                                </span>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );
}