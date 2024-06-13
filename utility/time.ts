export function formatMsToDisplay(ms: number): string {
    // Convert milliseconds to seconds
    let seconds = Math.floor(ms / 1000);

    // Calculate hours, minutes, and remaining seconds
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Pad single digit numbers with leading zeros
    const pad = (num: number) => num.toString().padStart(2, '0');

    // Return formatted time as string
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function convertMinToMs(minutes: number): number {
    return minutes * 60 * 1000;
}