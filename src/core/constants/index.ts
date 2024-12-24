/* eslint-disable @typescript-eslint/no-magic-numbers */

export const SIXTY = 60 as const;
export const ONE_HUNDRED = 100 as const;
export const ONE_THOUSAND = 1000 as const;

export const ZERO = 0 as const;
export const ONE = 1 as const;
export const TEN = 10 as const;

export const ADDRESS_REGEX = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);
export const BYTES32_REGEX = new RegExp(/^(0x)?[0-9a-fA-F]{64}$/);

export enum HttpCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}
