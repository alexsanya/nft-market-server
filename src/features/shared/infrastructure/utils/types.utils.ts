import { ADDRESS_REGEX, BYTES32_REGEX, ONE, TWO, ZERO } from '../../../../core';

export function canConvertToStringToBigInt(str: string): boolean {
	try {
		BigInt(str);
		return true;
	} catch (error: unknown) {
		if (
			error instanceof TypeError ||
			((error as Record<string, unknown>).message as Record<string, (text: string) => unknown>).includes(
				'Invalid or unexpected token'
			)
		) {
			return false;
		}
		throw error;
	}
}

export function isAddress(data: unknown): boolean {
	return (data as string).length !== ZERO && ADDRESS_REGEX.test(data as string);
}

export function isBytes32(data: unknown): boolean {
	return (data as string).length !== ZERO && BYTES32_REGEX.test(data as string);
}

export function arrayify(data: string): Uint8Array {
	const bytes = [];
	const hexString = data.split('x')[ONE];
	for (let i = 0; i < hexString.length; i += TWO) {
		bytes.push(parseInt(hexString.slice(i, i + TWO), 16));
	}
	return new Uint8Array(bytes);
}
