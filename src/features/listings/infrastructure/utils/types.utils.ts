export function isDefinedAndValidNumber(variable: unknown) {
    return (
        typeof variable !== 'undefined' &&
        typeof variable === 'number' &&
        !isNaN(variable)
    );
}