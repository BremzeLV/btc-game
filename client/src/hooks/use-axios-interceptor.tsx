import ToastMessage from "@/components/ui/toast";
import { axiosInstance } from "@/lib/axios-instance";
import { isValidationError } from "@/lib/is-validation-error";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

function useAxiosInterceptor() {
    const title = "There has been an error";

	useEffect(() => {
		const interceptor = axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => response,
            (error: AxiosError) => {
				if (error.response?.status >= 400 && error.response?.status < 600) {
                    if (
                        isValidationError(error) &&
                        error.response?.data?.errors &&
                        typeof error.response?.data?.errors === "object"
                    ) {
                        const messages = Object.entries(error.response?.data?.errors).map(
                            ([field, message]) => `${field}: ${message}`
                        );

                        toast(<ToastMessage title={title} description={messages} />);
                    } else {
                        toast(<ToastMessage title={title} description={[error.message]} />);
                    }
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.response.eject(interceptor);
		};
	}, []);
}

export default useAxiosInterceptor;
