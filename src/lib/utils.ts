import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrometheusData, PrometheusResult } from "@/types/data";

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

interface FormattedDataPoint {
    time: number;
    value: number;
    total?: number;
}

// Updated to handle Prometheus data format
export function formatResourceData(prometheusData: PrometheusData): FormattedDataPoint[] {
    if (!prometheusData?.data?.result || !prometheusData.data.result.length) return [];
    
    // Extract values from the first result (assuming we're only querying one metric)
    const result: PrometheusResult = prometheusData.data.result[0];
    const series = result?.values || [];
    
    return series
        .map((dataPoint: [number, string]) => {
            const timestamp = dataPoint[0] * 1000; // Convert to milliseconds
            const value = parseFloat(dataPoint[1]);
            
            // For CPU data, we just return the value
            // For multi-value data, we could expand this
            return {
                time: timestamp,
                value: value,
                total: value, // For backward compatibility
            };
        })
        .sort((a: FormattedDataPoint, b: FormattedDataPoint) => a.time - b.time);
}
