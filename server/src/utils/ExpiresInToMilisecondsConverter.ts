require('module-alias/register')

export default function convertToMilliseconds(str: string) {
    const unit = str.slice(-1);
    const value = parseInt(str.slice(0, -1), 10);

    switch (unit) {
        case 'd': // days
            return value * 24 * 60 * 60 * 1000;
        case 'h': // hours
            return value * 60 * 60 * 1000;
        case 'm': // minutes
            return value * 60 * 1000;
        case 's': // seconds
            return value * 1000;
        default:
            return NaN; // Not a number for invalid input
    }
}