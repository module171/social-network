export class Helpers {
    static firstLetterUpperCase(str: string): string {
        const valueString = str.toLowerCase();
        return valueString.split('').map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toUpperCase()}`).join('');
    }
    static lowCase(str: string): string {
        const valueString = str.toLowerCase();
        return valueString.split('').map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toUpperCase()}`).join('');
    }
}