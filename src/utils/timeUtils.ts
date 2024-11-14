export function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);

    if (hours === 0) {
        return remainingMinutes === 0 ? '< 1m' : `${remainingMinutes}m`;
    } else {
        return `${hours}h ${remainingMinutes}m`;
    }
}

export function formatSecondsToHMS(currentSeconds: number): string {
    const durationHours = Math.floor(currentSeconds / 3600);
    const durationMinutes = Math.floor((currentSeconds % 3600) / 60);
    const durationSeconds = currentSeconds % 60;
    return `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
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

export const getDatesOfWeek = (date: Date): Date[] => {
    let currentDay = new Date(date);
    let dayOfWeek = currentDay.getDay();
    let distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    let monday = new Date(currentDay);
    monday.setDate(currentDay.getDate() + distanceToMonday);

    let week: Date[] = [];
    for (let i = 0; i < 7; i++) {
        week.push(new Date(monday));
        monday.setDate(monday.getDate() + 1);
    }

    return week;
};

