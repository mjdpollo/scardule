"use client";
import {FilterFormData} from "@/components/ScheduleFilterForm";
import {format} from "date-fns";
import qs from "qs";

export function getScarTechURL(): string {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? "https://scar-tech.site" : "http://127.0.0.1:8000";
}

export function getQueryFromFormData(data: FilterFormData) {
  return qs.stringify(data, {
    skipNulls: true,
    allowDots: true,
    filter: (_, value) =>
      value instanceof Date ? format(value, "yyyy-MM-dd") : value,
  });
}
