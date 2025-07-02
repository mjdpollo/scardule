"use client";

import Header from "@/components/Header";
import ScheduleFilterForm from "@/components/ScheduleFilterForm";
import ScheduleModal from "@/components/ScheduleModal";
import SchedulerTable from "@/components/SchedulerTable";
import {Schedule} from "@/type/schedule";
import {useState} from "react";

const creatingSchuedule: Schedule = {
  id: null,
  stock_date: null,
  release_date: null,
  car_model: "",
  car_number: "",
  color_code: "",
  supplier: "",
  charger: "",
  content: "",
  working_content: null,
  estimate: 0,
  note: "",
  status: "대기",
  front_bumper: false,
  left_front_fender: false,
  right_front_fender: false,
  left_front_door: false,
  right_front_door: false,
  left_rear_door: false,
  right_rear_door: false,
  left_rear_fender: false,
  right_rear_fender: false,
  rear_bumper: false,
  rear_door: false,
  bonnet: false,
  hood: false,
  number_of_repairs: 0,
};

export default function Home() {
  const [selectedSchedule, setSelectedSchedule] =
    useState<Schedule>(creatingSchuedule);
  const [showModal, setShowModal] = useState(false);

  const openCreateScheduleModal = () => {
    setSelectedSchedule(creatingSchuedule);
    openModal();
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSaveSchedule = (schedule: Schedule) => {
    console.log("💾 Saving schedule:", schedule);
    if (schedule.id) {
      //UPDATE
    } else {
      //CREATE
    }
    closeModal();
  };
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  return (
    <>
      <Header />
      <ScheduleFilterForm
        setSchedules={setSchedules}
        openCreateScheduleModal={openCreateScheduleModal}
      />
      <SchedulerTable
        schedules={schedules}
        setSelectedSchedule={setSelectedSchedule}
        openModal={openModal}
      />
      <ScheduleModal
        visible={showModal}
        onClose={closeModal}
        onSubmit={handleSaveSchedule}
        schedule={selectedSchedule}
      />
    </>
  );
}
