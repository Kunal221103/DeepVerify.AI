export default function DownloadButton({

    report

}) {

    return (

        <a

            href={`http://127.0.0.1:8000/${report}`}

            target="_blank"

            rel="noreferrer"

            className="bg-blue-600 px-6 py-3 rounded-xl"

        >

            Download PDF

        </a>

    );

}