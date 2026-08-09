import api from "./api";

export async function downloadReport(scanId) {

    return `${api.defaults.baseURL}/report/${scanId}`;

}