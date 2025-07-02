"use client";
// app/user/page.tsx
import Header from "@/components/Header";
import UserScheduleRow from "@/components/UserScheduleRow";
import {Schedule} from "@/type/schedule";
import {useEffect, useState} from "react";
import {getScarTechURL} from "../utility/utility";

export default function UserPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await fetch(
          `${getScarTechURL()}/api/schedules/?status=\uB300\uAE30`
        );
        if (!res.ok) throw new Error("Failed to fetch schedules");
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSchedules();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-start px-4 py-8">
      <Header />
      <div className="overflow-x-auto w-full max-w-7xl">
        <table className="table-auto w-full border-collapse border border-black text-base">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-black text-base px-4 py-3"></th>
              <th className="border border-black text-base px-4 py-3">
                차량번호
              </th>
              <th className="border border-black text-base px-4 py-3">차종</th>
              <th className="border border-black text-base px-4 py-3">
                작업내용
              </th>
              <th className="border border-black text-base px-4 py-3">판수</th>
              <th className="border border-black text-base px-4 py-3">
                입고일
              </th>
              <th className="border border-black text-base px-4 py-3">
                출고일
              </th>
              <th className="border border-black text-base px-4 py-3">
                담당자
              </th>
              <th className="border border-black text-base px-4 py-3">
                입고처
              </th>
              <th className="border border-black text-base px-4 py-3">비고</th>
              <th className="border border-black text-base px-4 py-3">
                색상코드
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <UserScheduleRow
                key={schedule.id}
                schedule={schedule}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
