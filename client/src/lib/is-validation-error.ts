import { AxiosError } from "axios";
import { ValidationError } from "./types";

export function isValidationError<T extends AxiosError<unknown, unknown>>(
	error: T
): error is AxiosError<ValidationError> & T {
	return error.status === 422;
}
