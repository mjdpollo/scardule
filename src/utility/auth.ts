"use client";
import {api} from "./api";

export type CurrentUser = {
  editable: boolean;
  role?: string;
  username?: string;
  name?: string;
};

// access_token 쿠키는 httponly라 프런트에서 직접 디코딩할 수 없으므로
// /api/me/ 를 통해 서버에서 판정한 사용자 정보를 받아온다.
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await api.get("/api/me/");
    if (res.status !== 200) return null;
    return res.data as CurrentUser;
  } catch (err) {
    console.error("Failed to fetch current user", err);
    return null;
  }
}
