import api from "./api";

export async function scanMedia(file) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/scan",
        formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
}