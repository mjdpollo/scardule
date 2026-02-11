"use client";
// app/user/page.tsx
import ComponentModal from "@/components/ComponentModal";
import UserScheduleRow from "@/components/UserScheduleRow";
import WorkerModal from "@/components/WorkerModal";
import {
  getToggledStatus,
  ReleaseStatusPatchData,
  Schedule,
  sortedGroupedSchedulesByReleaseExpectingDate,
} from "@/type/schedule";
import {getScarTechURL} from "@/utility/utility";
import axios from "axios";
import {format, subDays} from "date-fns";
import {Fragment, useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import UserTableHeader from "../../components/UserTableHeader";

export default function UserPage() {
  const [workingSchedules, setWorkingSchedules] = useState<Schedule[]>([]);
  const [delayedSchedules, setDelayedSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const workerModalForm = useForm<Schedule>();
  const componentModalForm = useForm<Schedule>();

  const openComponentModal = () => setShowComponentModal(true);
  const closeComponentModal = () => setShowComponentModal(false);
  const openWorkerModal = () => setShowWorkerModal(true);
  const closeWorkerModal = () => setShowWorkerModal(false);

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
      console.log("delatedData: ", delayedData);
      console.log("workingData: ", workingData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComponent = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: Schedule = {...schedule, component: schedule.component};
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    }
    await fetchSchedules();
    closeComponentModal();
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
    }
    await fetchSchedules();
    closeWorkerModal();
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
    }
    await fetchSchedules();
  };
  const handleUpdateBottomStatus = async (schedule: Schedule) => {
    if (schedule.id) {
      const data: Schedule = {
        ...schedule,
        bottom_status: getToggledStatus(schedule.bottom_status),
      };
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        data
      );
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
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
    fetchSchedules();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-start px-4 py-8">
      <div className="relative w-full max-w-7xl">
        <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-7xl bg-red-200">
          지연차량
        </div>
        <table className="table-fixed w-full border-separate border-spacing-0 border-[0.5px] border-black text-base">
          <UserTableHeader />
          <tbody>
            {sortedGroupedSchedulesByReleaseExpectingDate(delayedSchedules).map(
              ([date, rows]) => (
                <Fragment key={date.toString()}>
                  <tr className="bg-yellow-100 font-bold text-center">
                    <td
                      colSpan={16}
                      className="border-[0.5px] border-black px-2 py-2"
                    >
                      {date} /{" "}
                      {rows.reduce(
                        (sum, s) => sum + (s.number_of_repairs || 0),
                        0
                      )}
                      판
                    </td>
                  </tr>
                  {rows.map((schedule, index) => (
                    <UserScheduleRow
                      key={schedule.id}
                      schedule={schedule}
                      openWorkerModal={(schedule) => {
                        setSelectedSchedule(schedule);
                        openWorkerModal();
                      }}
                      openComponentModal={(schedule) => {
                        setSelectedSchedule(schedule);
                        openComponentModal();
                      }}
                      handleUpdatePlateStatus={handleUpdatePlateStatus}
                      handleUpdateBottomStatus={handleUpdateBottomStatus}
                      handleUpdatePaintStatus={handleUpdatePaintStatus}
                      handleUpdateCommonStatus={handleUpdateCommonStatus}
                      handleUpdateReleaseStatus={handleUpdateReleaseStatus}
                      index={index}
                    />
                  ))}
                </Fragment>
              )
            )}
          </tbody>
        </table>
        <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-7xl bg-lime-200">
          진행차량
        </div>
        <table className="table-fixed w-full border-separate border-spacing-0 border-[0.5px] border-black text-base">
          <UserTableHeader />
          <tbody>
            {sortedGroupedSchedulesByReleaseExpectingDate(workingSchedules).map(
              ([date, rows]) => (
                <Fragment key={date.toString()}>
                  <tr className="bg-yellow-100 font-bold text-center">
                    <td
                      colSpan={16}
                      className="border-[0.5px] border-black px-2 py-2"
                    >
                      {date} /{" "}
                      {rows.reduce(
                        (sum, s) => sum + (s.number_of_repairs || 0),
                        0
                      )}
                      판
                    </td>
                  </tr>
                  {rows.map((schedule, index) => (
                    <UserScheduleRow
                      key={schedule.id}
                      schedule={schedule}
                      openComponentModal={(schedule) => {
                        setSelectedSchedule(schedule);
                        openComponentModal();
                      }}
                      openWorkerModal={(schedule) => {
                        setSelectedSchedule(schedule);
                        openWorkerModal();
                      }}
                      handleUpdatePlateStatus={handleUpdatePlateStatus}
                      handleUpdateBottomStatus={handleUpdateBottomStatus}
                      handleUpdatePaintStatus={handleUpdatePaintStatus}
                      handleUpdateCommonStatus={handleUpdateCommonStatus}
                      handleUpdateReleaseStatus={handleUpdateReleaseStatus}
                      index={index}
                    />
                  ))}
                </Fragment>
              )
            )}
          </tbody>
        </table>
      </div>
      <FormProvider {...workerModalForm}>
        <WorkerModal
          visible={showWorkerModal}
          handleClose={closeWorkerModal}
          onSubmit={handleUpdateWorker}
          schedule={selectedSchedule}
        />
      </FormProvider>
      <FormProvider {...componentModalForm}>
        <ComponentModal
          visible={showComponentModal}
          handleClose={closeComponentModal}
          onSubmit={handleUpdateComponent}
          schedule={selectedSchedule}
        />
      </FormProvider>
    </div>
  );
}
