"use client";

import ScheduleFilterForm, {
  FilterFormData,
  filterResetData,
} from "@/components/ScheduleFilterForm";
import ScheduleModal from "@/components/ScheduleModal";
import SchedulerTable from "@/components/SchedulerTable";
import {Schedule} from "@/type/schedule";
import {getQueryFromFormData} from "@/utility/utility";
import {api} from "@/utility/api";
import {format, subDays} from "date-fns";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

export default function SchedulerPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const [showModal, setShowModal] = useState(false);
  const scheduleUpdatingForm = useForm<Schedule>({
    defaultValues: selectedSchedule,
  });
  const scheduleFilterForm = useForm<FilterFormData>({
    defaultValues: filterResetData,
  });

  const openUpdatingScheduleModal = () => setShowModal(true);
  const closeUpdatingScheduleModal = () => setShowModal(false);

  const [notDoneSchedules, setNotDoneSchedules] = useState<Schedule[]>([]);

  const fetchNotDoneSchedules = async () => {
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    try {
      const waitingRes = await api.get(
        `/api/schedules/?release_expected_date__lte=${yesterday}&release_status=대기`
      );
      if (waitingRes.status !== 200)
        throw new Error("Failed to fetch waiting schedules");
      const emergencyRes = await api.get(
        `/api/schedules/?release_expected_date__lte=${yesterday}&release_status=응급`
      );
      if (emergencyRes.status !== 200)
        throw new Error("Failed to fetch emergency schedules");
      const data = [...waitingRes.data, ...emergencyRes.data];
      setNotDoneSchedules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    const data = scheduleFilterForm.getValues();
    const query = getQueryFromFormData(data);
    const res = await api.get(`/api/schedules/?${query}`);
    setSchedules(res.data);
  };

  const handleUpdatingSchedule = async (schedule: Schedule) => {
    console.log("💾 Saving schedule:", schedule);
    if (schedule.id) {
      const res = await api.put(`/api/schedules/${schedule.id}/`, schedule);
      if (res.status !== 200) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("에러가 발생했습니다!");
    }
    await fetchNotDoneSchedules();
    await handleSearch();
    closeUpdatingScheduleModal();
  };

  const handleDelete = async (schedule: Schedule | undefined) => {
    console.log("💾 Saving schedule:", schedule);
    if (!schedule) return;
    if (schedule.id) {
      const res = await api.delete(`/api/schedules/${schedule.id}/`);
      if (res.status !== 204) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("에러가 발생했습니다!");
    }
    await fetchNotDoneSchedules();
    await handleSearch();
    closeUpdatingScheduleModal();
  };

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetchNotDoneSchedules();
    handleSearch(); // fetch all schedules by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormProvider {...scheduleFilterForm}>
        <ScheduleFilterForm handleSearch={handleSearch} />
      </FormProvider>
      <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-9xl bg-red-200">
        지연차량
      </div>
      <SchedulerTable
        schedules={notDoneSchedules}
        setSelectedSchedule={setSelectedSchedule}
        openModal={openUpdatingScheduleModal}
      />
      <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-9xl bg-lime-200">
        검색차량
      </div>
      <SchedulerTable
        schedules={schedules}
        setSelectedSchedule={setSelectedSchedule}
        openModal={openUpdatingScheduleModal}
      />
      <FormProvider {...scheduleUpdatingForm}>
        <ScheduleModal
          visible={showModal}
          handleClose={closeUpdatingScheduleModal}
          handleDelete={handleDelete}
          onSubmit={handleUpdatingSchedule}
          schedule={selectedSchedule}
        />
      </FormProvider>
    </>
  );
}
