import { cockpitChartData } from "@/constants/cockpitchart";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
export function filterCurrentDayDataUTC() {
    // Convert the targetDate to a Date object (UTC)
    const targetDateObj = new Date(1672542000000);

    // Set the start and end of the day (midnight to 11:59:59 PM) in UTC
    const startOfDay = new Date(
        Date.UTC(
            targetDateObj.getUTCFullYear(),
            targetDateObj.getUTCMonth(),
            targetDateObj.getUTCDate(),
            -1,
            0,
            0,
            0
        )
    ); // Start of day (UTC)
    const endOfDay = new Date(
        Date.UTC(
            targetDateObj.getUTCFullYear(),
            targetDateObj.getUTCMonth(),
            targetDateObj.getUTCDate(),
            22,
            59,
            59,
            999
        )
    );

    return cockpitChartData.filter((item: any) => {
        const datetime = new Date(item.x);
        return datetime >= startOfDay && datetime <= endOfDay;
    });
}
export function filterCurrentWeekDataUTC() {
    const currentDateBerlin = new Date(1672660800000);
    const currentWeekStart = new Date(
        Date.UTC(
            currentDateBerlin.getUTCFullYear(),
            currentDateBerlin.getUTCMonth(),
            currentDateBerlin.getUTCDate() - currentDateBerlin.getUTCDay(), // Adjust for the start of the ISO week
            -1,
            0,
            0,
            0 // Set to the start of the day (00:00:00 UTC)
        )
    );
    const currentWeekEnd = new Date(
        Date.UTC(
            currentWeekStart.getUTCFullYear(),
            currentWeekStart.getUTCMonth(),
            currentWeekStart.getUTCDate() + 6,
            22,
            59,
            59,
            999
        )
    );
    return cockpitChartData?.filter((item: any) => {
        const itemDate = new Date(item.x);
        return itemDate >= currentWeekStart && itemDate <= currentWeekEnd;
    });
}
export function filterByMonthYearUTC() {
    let input = 1672542000000;
    const targetDate = new Date(input);

    const targetMonth = targetDate.getUTCMonth();
    const targetYear = targetDate.getUTCFullYear();

    const startOfMonth = new Date(
        Date.UTC(targetYear, targetMonth, 0, 0, 0, 0, 0)
    );
    const endOfMonth = new Date(
        Date.UTC(targetYear, targetMonth + 1, 0, 22, 59, 59, 999)
    );

    return cockpitChartData?.filter((item: any) => {
        const datetime = new Date(item.x);
        return datetime >= startOfMonth && datetime <= endOfMonth;
    });
}
export function filterByCurrentQuarterUTC() {
    let input = 1680566400000;
    const now = new Date(input);
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const startOfQuarter = new Date(
        Date.UTC(currentYear, quarterStartMonth, 1, 0, 0, 0, 0)
    );
    const endOfQuarter = new Date(
        Date.UTC(currentYear, quarterStartMonth + 3, 0, 23, 59, 59, 999)
    );

    return cockpitChartData?.filter((item: any) => {
        const datetime = new Date(item.x);
        return datetime >= startOfQuarter && datetime <= endOfQuarter;
    });
}
export function filterDataByDateRange(startDate: string, endDate: string) {
    // Convert startDate and endDate to UTC and adjust to the start and end of the day
    const start = dayjs.utc(startDate).startOf("day").toDate(); // Start of the day in UTC
    const end = dayjs.utc(endDate).endOf("day").toDate(); // End of the day in UTC

    // Filter data within the date range
    return cockpitChartData?.filter((item: any) => {
        const itemDate = new Date(item.x); // Parse item's timestamp (assumed to be in UTC)
        return itemDate >= start && itemDate <= end;
    });
}
export function convertDatesToTimestamps1(arr: any) {
    return arr.map((item: any) => {
        // Check if the 'x' key exists in the object
        if (item.x) {
            const dateTime = item.x; // Assuming 'x' contains the date-time string in dd.mm.yyyy HH:mm format

            // Split the date-time into date and time parts
            const [date, time] = dateTime.split(" ");

            // Split the date part into day, month, and year
            const [day, month, year] = date.split(".");

            // Split the time part into hours and minutes
            const [hours, minutes] = time.split(":");

            // Create a Date object with the parsed components (months are 0-based)
            const formattedDate = new Date(
                year,
                month - 1,
                day,
                hours,
                minutes
            );

            // Replace the 'x' value with the timestamp
            item.x = formattedDate.getTime();
        }
        return item;
    });
}

const convert = () => {
    const dateTime: any = "21.01.2025 12:30"; // Example date-time string in dd.mm.yyyy HH:mm format

    // Split the date-time into date and time parts
    const [date, time] = dateTime.split(" ");

    // Split the date part into day, month, and year
    const [day, month, year] = date.split(".");

    // Split the time part into hours and minutes
    const [hours, minutes] = time.split(":");

    // Create a Date object with the parsed components (months are 0-based)
    const formattedDate = new Date(year, month - 1, day, hours, minutes);

    const timestamp = formattedDate.getTime();
};
/// for new formate
// Helper function to parse a date string in "dd/MM/yyyy HH:mm" format
function parseDate(dateTime: string): Date {
    const [date, time] = dateTime.split(" ");
    const [month, day, year] = date.split("/").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes);
}
function filterDataByDateRangeNew(data: any, from: any, to: any) {
    // Parse 'from' and 'to' into Date objects
    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    // Filter the data array
    return data.filter((item: any) => {
        const itemDate = parseDate(item.x); // Parse the x property of each item
        return itemDate >= fromDate && itemDate <= toDate;
    });
}

export function filterCurrentDateData(data: any[]) {
    const now = new Date("06/10/2021"); //mm/dd/yyyy

    // Get the current date in UTC at 00:00 and 23:59
    const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0
    );
    const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59
    );
    // Filter the data array
    return data.filter((item: any) => {
        const itemDate = parseDate(item.x); // Parse the x property of each item

        return itemDate >= startOfDay && itemDate <= endOfDay;
    });
}

function filterCurrentWeekData(data: any[]) {
    // Get current date in UTC
    const now = new Date("05/12/2024");

    // Calculate the start of the current week (Sunday 00:00 UTC)
    const startOfWeek = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - now.getUTCDay(), // Subtract days to get to Sunday
            0,
            0
        )
    );

    // Calculate the end of the current week (Saturday 23:59 UTC)
    const endOfWeek = new Date(
        Date.UTC(
            startOfWeek.getUTCFullYear(),
            startOfWeek.getUTCMonth(),
            startOfWeek.getUTCDate() + 6, // Add 6 days to get to Saturday
            23,
            59
        )
    );

    // Filter the data array
    return data.filter((item: any) => {
        const itemDate = parseDate(item.x); // Parse the x property of each item
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
}
function filterCurrentMonthData(data: any[]) {
    const now = new Date();

    // Get the start and end of the current month in UTC
    const startOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0)
    );
    const endOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59)
    ); // Last day of the month

    // Filter the data array
    return data.filter((item: any) => {
        const itemDate = parseDate(item.x); // Parse the x property of each item
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
    });
}

function filterCurrentQuarterData(data: any[]) {
    const now = new Date();
    const currentYear = now.getUTCFullYear();

    // Determine the start and end of the current quarter
    let startOfQuarter, endOfQuarter;

    if (now.getUTCMonth() < 3) {
        // Q1: Jan-Mar
        startOfQuarter = new Date(Date.UTC(currentYear, 0, 1, 0, 0)); // 1st Jan
        endOfQuarter = new Date(Date.UTC(currentYear, 2, 31, 23, 59)); // 31st Mar
    } else if (now.getUTCMonth() < 6) {
        // Q2: Apr-Jun
        startOfQuarter = new Date(Date.UTC(currentYear, 3, 1, 0, 0)); // 1st Apr
        endOfQuarter = new Date(Date.UTC(currentYear, 5, 30, 23, 59)); // 30th Jun
    } else if (now.getUTCMonth() < 9) {
        // Q3: Jul-Sep
        startOfQuarter = new Date(Date.UTC(currentYear, 6, 1, 0, 0)); // 1st Jul
        endOfQuarter = new Date(Date.UTC(currentYear, 8, 30, 23, 59)); // 30th Sep
    } else {
        // Q4: Oct-Dec
        startOfQuarter = new Date(Date.UTC(currentYear, 9, 1, 0, 0)); // 1st Oct
        endOfQuarter = new Date(Date.UTC(currentYear, 11, 31, 23, 59)); // 31st Dec
    }

    // Filter the data array
    return data.filter((item: any) => {
        const itemDate = parseDate(item.x); // Parse the x property of each item
        return itemDate >= startOfQuarter && itemDate <= endOfQuarter;
    });
}
