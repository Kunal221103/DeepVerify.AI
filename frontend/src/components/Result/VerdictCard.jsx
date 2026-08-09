export default function VerdictCard({ verdict }) {

    const colors = {
        AUTHENTIC: "bg-green-600",
        SUSPICIOUS: "bg-yellow-500",
        DEEPFAKE: "bg-red-600",
        "AI GENERATED": "bg-red-600"
    };

    return (

        <div className="flex justify-center">

            <div className={`${colors[verdict] || "bg-gray-600"} px-8 py-3 rounded-full`}>

                <h2 className="text-2xl font-bold">

                    {verdict}

                </h2>

            </div>

        </div>

    );

}