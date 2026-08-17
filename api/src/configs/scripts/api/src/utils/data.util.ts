export default class DateUtils {
    static parseLocalDate(value?: string): Date | undefined {
        if (!value) return undefined;

        const parts = value.split("-");

        if (parts.length !== 3) {
            return undefined;
        }

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return new Date(year, month - 1, day);
    }
}