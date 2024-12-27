import { ADDRESS_REGEX, ZERO } from "../../../../core";

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

export function isAddress(data: unknown) {
    return (data ||  (data as string).length !== ZERO && ADDRESS_REGEX.test(data as string));
}