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
  return cockpitChartData.filter((item: any) => {
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

  return cockpitChartData.filter((item: any) => {
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

  return cockpitChartData.filter((item: any) => {
    const datetime = new Date(item.x);
    return datetime >= startOfQuarter && datetime <= endOfQuarter;
  });
}
export function filterDataByDateRange(startDate: string, endDate: string) {
  // Convert startDate and endDate to UTC and adjust to the start and end of the day
  const start = dayjs.utc(startDate).startOf("day").toDate(); // Start of the day in UTC
  const end = dayjs.utc(endDate).endOf("day").toDate(); // End of the day in UTC

  // Filter data within the date range
  return cockpitChartData.filter((item: any) => {
    const itemDate = new Date(item.x); // Parse item's timestamp (assumed to be in UTC)
    return itemDate >= start && itemDate <= end;
  });
}
