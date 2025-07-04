"use client";
import {Auth, getScarTechURL} from "@/utility/utility";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";

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
    Auth.validate(router);
    Auth.redirectDefaultPage(router);
  }, [router, token]);

  return <div className="flex h-screen items-center justify-center"></div>;
}
