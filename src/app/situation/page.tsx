"use client";
// app/user/page.tsx
import StatusModal from "@/components/StatusModal";
import UserScheduleRow from "@/components/UserScheduleRow";
import {Schedule} from "@/type/schedule";
import {Auth, getScarTechURL} from "@/utility/utility";
import axios from "axios";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

export default function UserPage() {
  const router = useRouter();

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
    Auth.validate(router);
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-start px-4 py-8">
      <div className="overflow-x-auto w-full max-w-7xl">
        <table className="table-auto w-full border-collapse border border-black text-base">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-black text-base px-2- py-1"></th>
              <th className="border border-black text-base px-2- py-1">
                차량번호
              </th>
              <th className="border border-black text-base px-2- py-1">차종</th>
              <th className="border border-black text-base px-2- py-1">
                작업내용
              </th>
              <th className="border border-black text-base px-2- py-1">판수</th>
              <th className="border border-black text-base px-2- py-1">
                입고일
              </th>
              <th className="border border-black text-base px-2- py-1">
                출고일
              </th>
              <th className="border border-black text-base px-2- py-1">
                담당자
              </th>
              <th className="border border-black text-base px-2- py-1">
                입고처
              </th>
              <th className="border border-black text-base px-2- py-1">비고</th>
              <th className="border border-black text-base px-2- py-1">
                색상코드
              </th>
              <th className="border border-black text-base px-2- py-1">상태</th>
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
          handleClose={closeModal}
          onSubmit={handleUpdateStatus}
          schedule={selectedSchedule}
        />
      </FormProvider>
    </div>
  );
}
