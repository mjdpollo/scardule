"use client";
// app/user/page.tsx
import Header from "@/components/Header";
import StatusModal from "@/components/StatusModal";
import UserScheduleRow from "@/components/UserScheduleRow";
import {Schedule} from "@/type/schedule";
import axios from "axios";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {getScarTechURL} from "../utility/utility";

export default function UserPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const statusModalForm = useForm<Schedule>();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetchSchedules = async () => {
    const today = format(new Date(), "yyyy-MM-dd");

    try {
      const res = await fetch(
        `${getScarTechURL()}/api/schedules/?release_date__gte=${today}&release_date__lte=${today}`
      );
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      setSchedules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (schedule: Schedule) => {
    console.log("💾 Saving schedule:", schedule);
    if (schedule.id) {
      await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        schedule
      );
    } else {
      alert("Schedule이 선택되지 않았습니다.");
    }
    await fetchSchedules();
    closeModal();
  };

  useEffect(() => {
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
              <th className="border border-black text-base px-4 py-3">상태</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <UserScheduleRow
                key={schedule.id}
                schedule={schedule}
                onClick={(schedule) => {
                  setSelectedSchedule(schedule);
                  openModal();
                }}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      <FormProvider {...statusModalForm}>
        <StatusModal
          visible={showModal}
          onClose={closeModal}
          onSubmit={handleUpdateStatus}
          schedule={selectedSchedule}
        />
      </FormProvider>
    </div>
  );
}
