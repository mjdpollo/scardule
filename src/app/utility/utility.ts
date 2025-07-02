import {FilterFormData} from "@/components/ScheduleFilterForm";
import qs from "qs";

export function getScarTechURL(): string {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? "https://scartech.site" : "http://127.0.0.1:8000";
}

export const getQueryFromFormData = (data: FilterFormData) => {
  return qs.stringify(data, {
    skipNulls: true,
    allowDots: true,
    filter: (_, value) =>
      value instanceof Date ? value.toISOString().slice(0, 10) : value,
  });
};
