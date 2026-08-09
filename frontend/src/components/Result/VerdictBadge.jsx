export default function VerdictBadge({ verdict }) {

    let color =
        "bg-green-600";

    if (verdict === "SUSPICIOUS")
        color = "bg-yellow-500";

    if (
        verdict === "DEEPFAKE" ||
        verdict === "AI GENERATED"
    )
        color = "bg-red-600";

    return (

        <div
            className={`${color} px-6 py-3 rounded-full inline-block text-xl font-bold`}
        >

            {verdict}

        </div>

    );

}