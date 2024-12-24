export interface ValidationType {
	fields: string[];
	constraint: string;
}

export interface SuccessResponse<T> {
	data?: T;
}

export interface ErrorResponse {
	name: string;
	message: string;
	validationErrors?: ValidationType[];
	stack?: string;
}

export interface Signature {
    v: number;
    r: string;
    s: string;
}