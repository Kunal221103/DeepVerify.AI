import {
    CheckCircle
} from "lucide-react";

export default function SystemStatus() {

    const items = [

        "Image AI",

        "Video AI",

        "Audio AI",

        "Database",

        "Backend API"

    ];

    return (

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <h2 className="text-xl font-semibold mb-5">

                System Status

            </h2>

            <div className="space-y-4">

                {

                    items.map((item) => (

                        <div
                            key={item}
                            className="flex justify-between"
                        >

                            <span>

                                {item}

                            </span>

                            <CheckCircle
                                className="text-green-400"
                            />

                        </div>

                    ))

                }

            </div>

        </div>

    );

}