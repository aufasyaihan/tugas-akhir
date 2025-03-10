import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTime(time: number) {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
  });
}

export function formatResourceData(data: number[][]) {
    return data
        .map((dataPoint) => {
            const timestamp = dataPoint[0] * 1000;
            const value = dataPoint[1];

            if (dataPoint.length > 2) {
                const systemValue = dataPoint[2]!;
                const totalValue = value + systemValue;

                return {
                    time: timestamp,
                    user: value,
                    system: systemValue,
                    total: totalValue,
                };
            }

            return {
                time: timestamp,
                value,
            };
        })
        .sort((a, b) => a.time - b.time);
}
