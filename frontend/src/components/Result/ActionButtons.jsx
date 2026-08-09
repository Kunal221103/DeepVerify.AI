import { Link } from "react-router-dom";

export default function ActionButtons({ report }) {

    return (

        <div className="flex gap-4 mt-10">

            <a

                href={`http://127.0.0.1:8000/${report}`}

                target="_blank"

                rel="noreferrer"

                className="bg-blue-600 px-6 py-3 rounded-lg"

            >

                Download Report

            </a>

            <Link

                to="/upload"

                className="bg-slate-700 px-6 py-3 rounded-lg"

            >

                Scan Again

            </Link>

        </div>

    );

}