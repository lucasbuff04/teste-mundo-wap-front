import axios from "axios";

export const axiosInstance = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.request) {
			console.error("No response received:", error.request);
		} else {
			console.error("Error setting up the request:", error.message);
		}
		return Promise.reject(error);
	},
);

export const axiosViaCep = axios.create({
	baseURL: "https://viacep.com.br/ws",
	headers: {
		"Content-Type": "application/json",
	},
});

axiosViaCep.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.request) {
			console.error("No response received from viaCep:");
		} else {
			console.error("Error setting up the request to viaCep:");
		}
		return Promise.reject(error);
	},
);
