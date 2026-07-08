"use client";
import ScheduleModal from "@/components/ScheduleModal";
import SchedulerTable from "@/components/SchedulerTable";
import {Schedule} from "@/type/schedule";
import {getScarTechURL} from "@/utility/utility";
import axios from "axios";
import {endOfWeek, format, startOfWeek} from "date-fns";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

export default function SchedulerPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const [showModal, setShowModal] = useState(false);
  const scheduleUpdatingForm = useForm<Schedule>({
    defaultValues: selectedSchedule,
  });

  const openUpdatingScheduleModal = () => setShowModal(true);
  const closeUpdatingScheduleModal = () => setShowModal(false);

  const [weekSchedules, setWeekSchedules] = useState<Schedule[]>([]);

  const fetchWeekSchedules = async () => {
    // Get Monday and Sunday of the current week
    const weekStart = format(
      startOfWeek(new Date(), {weekStartsOn: 1}),
      "yyyy-MM-dd"
    ); // Monday
    const weekEnd = format(
      endOfWeek(new Date(), {weekStartsOn: 1}),
      "yyyy-MM-dd"
    ); // Sunday

    try {
      const thisWeekRes = await axios.get(
        `${getScarTechURL()}/api/schedules/?release_expected_date__gte=${weekStart}&release_expected_date__lte=${weekEnd}`
      );
      if (thisWeekRes.status !== 200)
        throw new Error("Failed to fetch schedules");

      setWeekSchedules(thisWeekRes.data); // ✅ Set this week's schedules here
    } catch (err) {
      console.error("Error fetching week schedules:", err);
    }
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
    await fetchWeekSchedules();
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
    await fetchWeekSchedules();
    closeUpdatingScheduleModal();
  };

  useEffect(() => {
    fetchWeekSchedules();
  }, []);

  return (
    <>
      <div className="border border-b-0 border-black text-xl font-bold p-3 mt-10 w-9xl bg-blue-200">
        이번주 차량
      </div>
      <SchedulerTable
        schedules={weekSchedules}
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
