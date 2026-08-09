export default function ProbabilityBars({ image }) {

    const real = image.real_probability || 0;
    const fake = image.fake_probability || 0;

    return (

        <div className="bg-slate-900 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-6">

                AI Probability

            </h2>

            <div className="mb-6">

                <div className="flex justify-between">

                    <span>Real</span>

                    <span>{real}%</span>

                </div>

                <div className="w-full h-3 bg-slate-700 rounded-full mt-2">

                    <div

                        className="bg-green-500 h-3 rounded-full"

                        style={{ width: `${real}%` }}

                    />

                </div>

            </div>

            <div>

                <div className="flex justify-between">

                    <span>Fake</span>

                    <span>{fake}%</span>

                </div>

                <div className="w-full h-3 bg-slate-700 rounded-full mt-2">

                    <div

                        className="bg-red-500 h-3 rounded-full"

                        style={{ width: `${fake}%` }}

                    />

                </div>

            </div>

        </div>

    );

}