import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  subMinutes,
  parseISO,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const TIMEZONE = "Australia/Sydney";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCorrectHour = (time: { ampm: string; hours: number }) => {
  if (time.ampm === "am" && time.hours === 12) return 0;
  else if (time.ampm === "pm" && time.hours !== 12) return time.hours + 12;
  else return time.hours;
};

export const isInsideOpenHours = (appSettings: {
  times: {
    [key: string]: {
      earliest: string;
      latest: string;
    };
  };
}) => {
  const now = toZonedTime(new Date(), TIMEZONE);
  const dayOfWeek = format(now, "EEEE");

  let timesKey;
  if (dayOfWeek === "Sunday") {
    timesKey = "sunday";
  } else if (dayOfWeek === "Saturday") {
    timesKey = "saturday";
  } else {
    timesKey = "weekDay";
  }

  const earliestParts = appSettings?.times[timesKey].earliest.split(":");
  const latestParts = appSettings?.times[timesKey].latest.split(":");

  const earliestTime = setMinutes(
    setHours(now, Number(earliestParts[0])),
    Number(earliestParts[1])
  );

  const latestTime = subMinutes(
    setMinutes(setHours(now, Number(latestParts[0])), Number(latestParts[1])),
    15
  );

  return !isBefore(now, earliestTime) && isBefore(now, latestTime);
};

export const pastDateTime = (
  date: string,
  time: { ampm: string; hours: number; minutes: number }
) => {
  const selectedDateTime = setMinutes(
    setHours(parseISO(date), getCorrectHour(time)),
    time.minutes
  );
  const now = new Date();

  return isAfter(now, selectedDateTime);
};

export const validBookingDateTime = (
  date: string,
  time: { ampm: string; hours: number; minutes: number },
  appSettings: {
    unavailableDates?: string[];
    times: {
      [key: string]: {
        earliest: string;
        latest: string;
        openLatest?: string;
      };
    };
  }
) => {
  const selectedDateTime = toZonedTime(
    setMinutes(setHours(parseISO(date), getCorrectHour(time)), time.minutes),
    TIMEZONE
  );
  const dayOfWeek = format(selectedDateTime, "EEEE");

  const unavailableDate = appSettings?.unavailableDates?.find((dateString) => {
    return (
      format(selectedDateTime, "dd/MM/yyyy") ===
      format(toZonedTime(parseISO(dateString), TIMEZONE), "dd/MM/yyyy")
    );
  });

  if (unavailableDate) {
    return false;
  }

  let timesKey;
  if (dayOfWeek === "Sunday") {
    timesKey = "sunday";
  } else if (dayOfWeek === "Saturday") {
    timesKey = "saturday";
  } else {
    timesKey = "weekDay";
  }

  const earliestParts = appSettings?.times[timesKey].earliest.split(":");
  const latestParts = isInsideOpenHours(appSettings)
    ? appSettings?.times[timesKey].openLatest?.split(":")
    : appSettings?.times[timesKey].latest.split(":");

  const earliestTime = toZonedTime(
    setMinutes(
      setHours(parseISO(date), Number(earliestParts[0])),
      Number(earliestParts[1])
    ),
    TIMEZONE
  );

  const latestTime = toZonedTime(
    setMinutes(
      setHours(parseISO(date), Number(latestParts?.[0] ?? "0")),
      Number(latestParts?.[1] ?? "0")
    ),
    TIMEZONE
  );

  return (
    !isBefore(selectedDateTime, earliestTime) &&
    isBefore(selectedDateTime, latestTime)
  );
};
