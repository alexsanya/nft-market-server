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