"use client";
import {FilterFormData} from "@/components/ScheduleFilterForm";
import {STATUS} from "@/type/schedule";
import {jwtDecode} from "jwt-decode";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import qs from "qs";

export function getScarTechURL(): string {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? "https://scartech.site" : "http://127.0.0.1:8000";
}

export function getQueryFromFormData(data: FilterFormData) {
  return qs.stringify(data, {
    skipNulls: true,
    allowDots: true,
    filter: (_, value) =>
      value instanceof Date ? value.toISOString().slice(0, 10) : value,
  });
}

export function getStatusClassName(status: STATUS) {
  switch (status) {
    case STATUS.EMERGENCY:
      return "emergency_status";
    case STATUS.WAIT:
      return "wait_status";
    case STATUS.COMPLETE:
      return "complete_status";
    case STATUS.WORKING:
      return "working_status";
    default:
      return "";
  }
}

type DecodedToken = {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  role: "scheduler" | "user"; // tighten this if roles are fixed
  username: string;
};

export const Auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  decodeToken(): DecodedToken | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  },

  getAuthRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.role ?? null;
  },

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded?.exp) return true;
    return decoded.exp < Math.floor(Date.now() / 1000);
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  validate(router: AppRouterInstance) {
    if (!localStorage.getItem("token")) {
      router.replace(getScarTechURL());
    }
  },

  redirectDefaultPage(router: AppRouterInstance) {
    if (!localStorage.getItem("token")) {
      router.replace(getScarTechURL());
    }

    try {
      const userRole = this.getAuthRole();

      if (userRole === "scheduler") {
        router.replace("/scheduler");
      } else if (userRole === "user") {
        router.replace("/situation");
      } else {
        router.replace(getScarTechURL());
      }
    } catch (err) {
      console.error("JWT decode/validation failed", err);
      router.replace(getScarTechURL());
    }
  },
};
