"use client";

import ScheduleFilterForm from "@/components/ScheduleFilterForm";
import ScheduleModal from "@/components/ScheduleModal";
import SchedulerTable from "@/components/SchedulerTable";
import {Schedule} from "@/type/schedule";
import {Auth, getQueryFromFormData, getScarTechURL} from "@/utility/utility";
import axios from "axios";
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
  const scheduleFilterForm = useForm();

  const openUpdatingScheduleModal = () => setShowModal(true);
  const closeUpdatingScheduleModal = () => setShowModal(false);

  const handleSearch = async () => {
    const data = scheduleFilterForm.getValues();
    const query = getQueryFromFormData(data);
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
    handleSearch(); // fetch all schedules by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormProvider {...scheduleFilterForm}>
        <ScheduleFilterForm handleSearch={handleSearch} />
      </FormProvider>
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
