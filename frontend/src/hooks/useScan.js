import { useState } from "react";
import { scanMedia } from "../services/scanService";

export default function useScan() {

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const scan = async(file) => {

        setLoading(true);

        try {

            const data = await scanMedia(file);

            setResult(data);

        } finally {

            setLoading(false);

        }

    };

    return {

        loading,

        result,

        scan

    };

}