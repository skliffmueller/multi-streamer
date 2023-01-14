const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export function toDateString(date: Date) {
    const monthIndex = date.getMonth();
    const twelveHour = (date.getHours() % 12) + 1;
    const amPm = date.getHours() < 12 ? 'am' : 'pm';
    return `${months[monthIndex]} ${date.getDate()} ${twelveHour}:${doubleZero(date.getMinutes())}${amPm}`;
}

export function secondsToTime(seconds: number) {
    const ms = seconds % 1;
    seconds -= ms;
    const s = seconds % 60;
    seconds -= s;
    const msecs = (seconds % 3600);
    const m = msecs / 60;
    seconds -= msecs;
    const h = seconds / 3600;

    return h
            ? `${h}:${doubleZero(m)}:${doubleZero(s)}`
            : `${m}:${doubleZero(s)}`;
}

export function doubleZero(value: number) {
    return value < 10
                ? `0${value}`
                : `${value}`;
}