import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_BACKEND_PREFIX}`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});
