export function TimeConversion(string) {
    return string.replace('T', ' ').substring(0, 16);
}