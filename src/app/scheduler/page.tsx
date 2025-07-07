"use client";

import ScheduleFilterForm, {
  FilterFormData,
  filterResetData,
} from "@/components/ScheduleFilterForm";
import ScheduleModal from "@/components/ScheduleModal";
import SchedulerTable from "@/components/SchedulerTable";
import {Schedule} from "@/type/schedule";
import {Auth, getQueryFromFormData, getScarTechURL} from "@/utility/utility";
import axios from "axios";
import {format, subDays} from "date-fns";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

export default function SchedulerPage() {
  const router = useRouter();

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
      const waitingRes = await axios.get(
        `${getScarTechURL()}/api/schedules/?release_expected_date__lte=${yesterday}&release_status=대기`
      );
      if (waitingRes.status !== 200)
        throw new Error("Failed to fetch schedules");
      const emergencyRes = await axios.get(
        `${getScarTechURL()}/api/schedules/?release_expected_date__lte=${yesterday}&release_status=응급`
      );
      if (waitingRes.status !== 200)
        throw new Error("Failed to fetch schedules");
      const data = [...waitingRes.data, ...emergencyRes.data];
      setNotDoneSchedules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    const data = scheduleFilterForm.getValues();
    const query = getQueryFromFormData(data);
    console.log(query);
    const res = await axios.get(`${getScarTechURL()}/api/schedules/?${query}`);
    console.log(res.data);
    setSchedules(res.data);
  };

  const handleUpdatingSchedule = async (schedule: Schedule) => {
    console.log("💾 Saving schedule:", schedule);
    if (schedule.id) {
      const res = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        schedule
      );
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
      const res = await axios.delete(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`
      );
      if (res.status !== 204) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("에러가 발생했습니다!");
    }
    await handleSearch();
    closeUpdatingScheduleModal();
  };

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    Auth.validate(router);
    fetchNotDoneSchedules();
    handleSearch(); // fetch all schedules by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormProvider {...scheduleFilterForm}>
        <ScheduleFilterForm handleSearch={handleSearch} />
      </FormProvider>
      <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-7xl bg-red-200">
        지연차량
      </div>
      <SchedulerTable
        schedules={notDoneSchedules}
        setSelectedSchedule={setSelectedSchedule}
        openModal={openUpdatingScheduleModal}
      />
      <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-7xl bg-lime-200">
        진행차량
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
