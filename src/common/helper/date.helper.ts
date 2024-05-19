import { DayOfWeek } from "../enum/day-of-week.enum"; // Giả sử enum DayOfWeek ở file day-of-week.enum.ts

export class DateHelper {
    static formatTime(timeString: string): string {
        const [hours, minutes] = timeString.split(':');
        const hoursNumber = parseInt(hours, 10);
        const period = hoursNumber >= 12 ? 'PM' : 'AM';
        const formattedHours = (hoursNumber % 12) || 12;
        return `${formattedHours}.${minutes} ${period}`;
    }

    static formatSchedule(startDayOfWeek: string, startTime: string, endDayOfWeek: string, endTime: string): string {
        const startDayString = this.capitalizeWords(startDayOfWeek);
        const endDayString = this.capitalizeWords(endDayOfWeek);
        const formattedStartTime = this.formatTime(startTime);
        const formattedEndTime = this.formatTime(endTime);
        return `${startDayString} - ${endDayString}, ${formattedStartTime} - ${formattedEndTime}`;
    }

    static capitalizeWords(str: string): string {
        return str.replace(/\w\S*/g, (word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
    }
}