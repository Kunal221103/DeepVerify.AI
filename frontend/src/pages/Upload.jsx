import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import UploadBox from "../components/UploadBox";
import api from "../services/api";

export default function Upload() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const scanMedia = async () => {

        if (!file) {
            alert("Please select a file.");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/scan", formData);

            navigate("/result", {
                state: response.data
            });

        }

        catch (err) {

            console.error(err);
            alert("Scan Failed");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <Layout>

            <h1 className="text-4xl font-bold mb-8">
                Upload Media
            </h1>

            <UploadBox onFileSelect={setFile} />

            {

                file && (

                    <div className="mt-8">

                        <h2 className="text-xl font-semibold">
                            Selected File
                        </h2>

                        <p>{file.name}</p>

                        <button
                            onClick={scanMedia}
                            disabled={loading}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                        >
                            {loading ? "Scanning..." : "Scan with AI"}
                        </button>

                    </div>

                )

            }

        </Layout>

    );

}