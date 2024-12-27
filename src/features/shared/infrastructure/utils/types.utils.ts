import { ADDRESS_REGEX, BYTES32_REGEX, ZERO } from "../../../../core";

export function canConvertToStringToBigInt(str: string) {
    try {
        const result = BigInt(str);
        return true;
    } catch (error: any) {
        if (error instanceof TypeError || error.message.includes('Invalid or unexpected token')) {
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