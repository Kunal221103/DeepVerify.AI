export default function ScanButton({

    loading,

    onClick

}) {

    return (

        <button

            onClick={onClick}

            disabled={loading}

            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl mt-8"

        >

            {

                loading

                    ? "Analyzing..."

                    : "Start AI Scan"

            }

        </button>

    );

}