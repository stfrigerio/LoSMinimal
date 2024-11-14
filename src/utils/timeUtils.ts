export function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);

    if (hours === 0) {
        return remainingMinutes === 0 ? '< 1m' : `${remainingMinutes}m`;
    } else {
        return `${hours}h ${remainingMinutes}m`;
    }
}

export function timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

export function minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function parseTimeToDecimal(t: string): number {
    const [hours, minutes] = t.split(':').map(d => +d);
    let decimal = hours + minutes / 60;
    if (decimal < 18) decimal += 24; // Shift times after midnight
    return decimal;
}
