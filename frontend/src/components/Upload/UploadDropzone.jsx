import { useDropzone } from "react-dropzone";

export default function UploadDropzone({ onFileSelect }) {

    const { getRootProps, getInputProps } = useDropzone({

        multiple: false,

        accept: {

            "image/*": [],

            "video/*": [],

            "audio/*": []

        },

        onDrop: files => {

            onFileSelect(files[0]);

        }

    });

    return (

        <div
            {...getRootProps()}
            className="border-2 border-dashed border-blue-500 rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition"
        >

            <input {...getInputProps()} />

            <h2 className="text-2xl font-bold">

                Drag & Drop Media

            </h2>

            <p className="text-slate-400 mt-2">

                Images • Videos • Audio

            </p>

            <button
                className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
            >
                Browse Files
            </button>

        </div>

    );

}