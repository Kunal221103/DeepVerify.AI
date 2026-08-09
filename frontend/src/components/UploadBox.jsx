import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadBox({ onFileSelect }) {

    const [fileName, setFileName] = useState("");

    const onDrop = (acceptedFiles) => {

        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        setFileName(file.name);

        onFileSelect(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    return (

        <div
            {...getRootProps()}
            className="border-2 border-dashed border-blue-500 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-800 transition"
        >

            <input {...getInputProps()} />

            {

                isDragActive ?

                    <p>Drop your file here...</p>

                    :

                    <>

                        <h2 className="text-2xl font-semibold">

                            Drag & Drop

                        </h2>

                        <p className="mt-2">

                            or click to choose a file

                        </p>

                    </>

            }

            {

                fileName && (

                    <div className="mt-5 text-green-400">

                        Selected:

                        <br />

                        {fileName}

                    </div>

                )

            }

        </div>

    );

}