import axios from "axios";
import { BASE_URL } from "./apiPaths";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',

    },
});
// export const apiCall = async (method, url, data = null) => {
//     try {
//         const response = await axiosInstance({
//             method: method,
//             url: url,
//             data: data,
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`API Call Error (${method} ${url}):`, error.response || error.message);
//         throw error;
//     }
// };

export const apiCall = async (method, url, data = null) => {
    try {
        const response = await axiosInstance({
            method: method,
            url: url,
            data: data, 
        });
        return response.data;
    } catch (error) {
        
        const errorMessage = error.response?.data?.message || `API call failed for ${method} ${url}`;
        throw new Error(errorMessage);
    }
};