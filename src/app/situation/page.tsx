"use client";
// app/user/page.tsx
import UserScheduleRow from "@/components/UserScheduleRow";
import WorkerModal from "@/components/WorkerModal";
import {
  getToggledStatus,
  groupSchedulesByReleaseExpectingDate,
  ReleaseStatusPatchData,
  Schedule,
  STATUS,
} from "@/type/schedule";
import {Auth, getScarTechURL} from "@/utility/utility";
import axios from "axios";
import {format, subDays} from "date-fns";
import {useRouter} from "next/navigation";
import {Fragment, useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import UserTableHeader from "../../components/UserTableHeader";

function lockedStatusAlert(schedule: Schedule) {
  if (!schedule.id) {
    alert("Schedule이 선택되지 않았습니다.");
  }
  if (schedule.release_status === STATUS.COMPLETE) {
    alert("출고가 완료된 차량입니다.");
  }
}

export default function UserPage() {
  const router = useRouter();

  const [workingSchedules, setWorkingSchedules] = useState<Schedule[]>([]);
  const [delayedSchedules, setDelayedSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const workerModalForm = useForm<Schedule>();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetchSchedules = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    try {
      const waitingRes = await axios.get(
        `${getScarTechURL()}/api/schedules/?release_expected_date__lte=${yesterday}&release_status=대기`
      );
      if (waitingRes.status !== 200)
        throw new Error("Failed to fetch schedules");
      const emergencyRes = await axios.get(
        `${getScarTechURL()}/api/schedules/?release_expected_date__lte=${yesterday}&release_status=응급`
      );
      if (emergencyRes.status !== 200)
        throw new Error("Failed to fetch schedules");
      const delayedData = [...waitingRes.data, ...emergencyRes.data];
      setDelayedSchedules(delayedData);
      const workingRes = await axios.get(
        `${getScarTechURL()}/api/schedules/?release_expected_date__gte=${today}`
      );
      if (workingRes.status !== 200)
        throw new Error("Failed to fetch Working Schedules");
      const workingData = workingRes.data;
      setWorkingSchedules(workingData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateWorker = async (schedule: Schedule) => {
    if (schedule.id && schedule.release_status !== STATUS.COMPLETE) {
      const data: Schedule = {...schedule, worker: schedule.worker};
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      lockedStatusAlert(schedule);
    }
    await fetchSchedules();
    closeModal();
  };

  const handleUpdatePlateStatus = async (schedule: Schedule) => {
    if (schedule.id && schedule.release_status !== STATUS.COMPLETE) {
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
      lockedStatusAlert(schedule);
    }
    await fetchSchedules();
  };
  const handleUpdatePaintStatus = async (schedule: Schedule) => {
    if (schedule.id && schedule.release_status !== STATUS.COMPLETE) {
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
      lockedStatusAlert(schedule);
    }
    await fetchSchedules();
  };
  const handleUpdateCommonStatus = async (schedule: Schedule) => {
    if (schedule.id && schedule.release_status !== STATUS.COMPLETE) {
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
      lockedStatusAlert(schedule);
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
        <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-7xl bg-red-200">
          지연차량
        </div>
        <table className="table-fixed w-full border-collapse border border-black text-base">
          <UserTableHeader />
          <tbody>
            {Object.entries(
              groupSchedulesByReleaseExpectingDate(delayedSchedules)
            ).map(([date, rows]) => (
              <Fragment key={date.toString()}>
                <tr className="bg-yellow-100 font-bold text-center">
                  <td colSpan={15} className="border border-black px-2 py-2">
                    {date}
                  </td>
                </tr>
                {rows.map((schedule, index) => (
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
              </Fragment>
            ))}
          </tbody>
        </table>
        <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-7xl bg-lime-200">
          진행차량
        </div>
        <table className="table-fixed w-full border-collapse border border-black text-base">
          <UserTableHeader />
          <tbody>
            {Object.entries(
              groupSchedulesByReleaseExpectingDate(workingSchedules)
            ).map(([date, rows]) => (
              <Fragment key={date.toString()}>
                <tr className="bg-yellow-100 font-bold text-center">
                  <td colSpan={15} className="border border-black px-2 py-2">
                    {date}
                  </td>
                </tr>
                {rows.map((schedule, index) => (
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
              </Fragment>
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
