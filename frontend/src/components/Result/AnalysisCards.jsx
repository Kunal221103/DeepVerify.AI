export default function AnalysisCards({

    metadata = {},

    ela = {},

    noise = {}

}) {

    return (

        <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-slate-900 rounded-xl p-6">

                <h2 className="text-xl font-semibold mb-3">

                    Metadata

                </h2>

                <h3 className="text-3xl font-bold">

                    {metadata.metadata_score ?? "--"}%

                </h3>

            </div>

            <div className="bg-slate-900 rounded-xl p-6">

                <h2 className="text-xl font-semibold mb-3">

                    ELA

                </h2>

                <h3 className="text-3xl font-bold">

                    {ela.ela_score ?? "--"}%

                </h3>

            </div>

            <div className="bg-slate-900 rounded-xl p-6">

                <h2 className="text-xl font-semibold mb-3">

                    Noise

                </h2>

                <h3 className="text-3xl font-bold">

                    {noise.noise_score ?? "--"}%

                </h3>

            </div>

        </div>

    );

}