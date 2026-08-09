import ReactPlayer from "react-player";

export default function FilePreview({ file }) {

    if (!file) return null;

    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image")) {

        return (

            <img
                src={url}
                className="rounded-xl w-80 mt-6"
            />

        );

    }

    if (file.type.startsWith("video")) {

        return (

            <ReactPlayer

                url={url}

                controls

                width="500px"

            />

        );

    }

    return (

        <audio
            controls
            src={url}
            className="mt-6"
        />

    );

}