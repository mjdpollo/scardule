"use client";
// app/user/page.tsx
import UserScheduleRow from "@/components/UserScheduleRow";
import WorkerModal from "@/components/WorkerModal";
import {
  getToggledStatus,
  ReleaseStatusPatchData,
  Schedule,
} from "@/type/schedule";
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
  const workerModalForm = useForm<Schedule>();

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

  const handleUpdateWorker = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: Schedule = {...schedule, worker: schedule.worker};
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("Schedule이 선택되지 않았습니다.");
    }
    await fetchSchedules();
    closeModal();
  };

  const handleUpdatePlateStatus = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: Schedule = {
        ...schedule,
        plate_status: getToggledStatus(schedule.plate_status),
      };
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("Schedule이 선택되지 않았습니다.");
    }
    await fetchSchedules();
  };
  const handleUpdatePaintStatus = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: Schedule = {
        ...schedule,
        paint_status: getToggledStatus(schedule.paint_status),
      };
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("Schedule이 선택되지 않았습니다.");
    }
    await fetchSchedules();
  };
  const handleUpdateCommonStatus = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: Schedule = {
        ...schedule,
        common_status: getToggledStatus(schedule.common_status),
      };
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("Schedule이 선택되지 않았습니다.");
    }
    await fetchSchedules();
  };
  const handleUpdateReleaseStatus = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: ReleaseStatusPatchData = {
        ...schedule,
        release_status: getToggledStatus(schedule.release_status),
      };
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("Schedule이 선택되지 않았습니다.");
    }
    await fetchSchedules();
  };

  useEffect(() => {
    Auth.validate(router);
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-start px-4 py-8">
      <div className="overflow-x-auto w-full max-w-7xl">
        <table className="table-fixed w-full border-collapse border border-black text-base">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="w-[20px] border border-black text-base px-1- py-1"></th>
              <th className="w-[80px] border border-black text-base px-1- py-1">
                차량번호
              </th>
              <th className="w-[100px] border border-black text-base px-1- py-1">
                차종
              </th>
              <th className="border border-black text-base px-1- py-1">
                작업내용
              </th>
              <th className="w-[40px] border border-black text-base px-1- py-1">
                판수
              </th>
              <th className="w-[60px] border border-black text-base px-1- py-1">
                입고일
              </th>
              <th className="w-[60px] border border-black text-base px-1- py-1">
                출고일
              </th>
              <th className="w-[80px] border border-black text-base px-1- py-1">
                차/대
              </th>
              <th className="w-[80px] border border-black text-base px-1- py-1">
                입고처
              </th>
              <th className="w-[60px] border border-black text-base px-1- py-1">
                색상
              </th>
              <th className="w-[60px] border border-black text-base px-1- py-1">
                작업자
              </th>
              <th className="w-[40px] border border-black text-base px-1- py-1">
                판금
              </th>
              <th className="w-[40px] border border-black text-base px-1- py-1">
                도장
              </th>
              <th className="w-[40px] border border-black text-base px-1- py-1">
                일반
              </th>
              <th className="w-[40px] border border-black text-base px-1- py-1">
                출고
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <UserScheduleRow
                key={schedule.id}
                schedule={schedule}
                openWorkerModal={(schedule) => {
                  setSelectedSchedule(schedule);
                  openModal();
                }}
                handleUpdatePlateStatus={handleUpdatePlateStatus}
                handleUpdatePaintStatus={handleUpdatePaintStatus}
                handleUpdateCommonStatus={handleUpdateCommonStatus}
                handleUpdateReleaseStatus={handleUpdateReleaseStatus}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      <FormProvider {...workerModalForm}>
        <WorkerModal
          visible={showModal}
          handleClose={closeModal}
          onSubmit={handleUpdateWorker}
          schedule={selectedSchedule}
        />
      </FormProvider>
    </div>
  );
}
