"use client";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {getScarTechURL} from "./utility/utility";

type DecodedToken = {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  role: "scheduler" | "user"; // tighten this if roles are fixed
  username: string;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let token = localStorage.getItem("token");

  const tokenFromQuery = searchParams.get("token");
  if (tokenFromQuery) {
    token = tokenFromQuery;
    localStorage.setItem("token", token); // Save it for later use
  }
  if (!tokenFromQuery) {
    router.replace(getScarTechURL());
  }

  useEffect(() => {
    try {
      const decoded = jwtDecode<DecodedToken>(token!);
      const userRole = decoded.role;
      if (userRole === "scheduler") {
        router.replace("/scheduler");
      } else if (userRole === "user") {
        router.replace("/user");
      } else {
        router.replace(getScarTechURL());
      }
    } catch (err) {
      console.error("JWT decode failed", err);
      router.replace(getScarTechURL());
    }
  }, [router, token]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Image
        src="/scardule.png"
        alt="Scardule Logo"
        width={200}
        height={50}
        priority
      />
    </div>
  );
}
