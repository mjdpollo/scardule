"use client";

import Header from "@/components/Header";
import ScheduleFilterForm from "@/components/ScheduleFilterForm";
import ScheduleModal from "@/components/ScheduleModal";
import SchedulerTable from "@/components/SchedulerTable";
import {Schedule, STATUS} from "@/type/schedule";
import axios from "axios";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {getQueryFromFormData, getScarTechURL} from "../utility/utility";

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
  status: STATUS.WAIT,
  front_bumper: null,
  left_front_fender: null,
  right_front_fender: null,
  left_front_door: null,
  right_front_door: null,
  left_rear_door: null,
  right_rear_door: null,
  left_rear_fender: null,
  right_rear_fender: null,
  rear_bumper: null,
  rear_door: null,
  bonnet: null,
  hood: null,
  number_of_repairs: 0,
};

export default function Home() {
  const [selectedSchedule, setSelectedSchedule] =
    useState<Schedule>(creatingSchuedule);
  const [showModal, setShowModal] = useState(false);
  const scheduleModalForm = useForm<Schedule>({
    defaultValues: selectedSchedule,
  });
  const scheduleFilterForm = useForm();

  const openCreateScheduleModal = () => {
    setSelectedSchedule(creatingSchuedule);
    openModal();
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSearch = async () => {
    const data = scheduleFilterForm.getValues();
    const query = getQueryFromFormData(data);
    const res = await axios.get(`${getScarTechURL()}/api/schedules/?${query}`);
    setSchedules(res.data);
  };

  const handleSaveSchedule = async (schedule: Schedule) => {
    console.log("💾 Saving schedule:", schedule);
    if (schedule.id) {
      const updateRes = await axios.put(
        `${getScarTechURL()}/api/schedules/${schedule.id}/`,
        schedule
      );
      console.log("updateRes : ", updateRes);
    } else {
      const createRes = await axios.post(
        `${getScarTechURL()}/api/schedules/`,
        schedule
      );
      console.log("createRes : ", createRes);
    }
    await handleSearch();
    closeModal();
  };
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    handleSearch(); // fetch all schedules by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <FormProvider {...scheduleFilterForm}>
        <ScheduleFilterForm
          handleSearch={handleSearch}
          openCreateScheduleModal={openCreateScheduleModal}
        />
      </FormProvider>
      <SchedulerTable
        schedules={schedules}
        setSelectedSchedule={setSelectedSchedule}
        openModal={openModal}
      />
      <FormProvider {...scheduleModalForm}>
        <ScheduleModal
          visible={showModal}
          onClose={closeModal}
          onSubmit={handleSaveSchedule}
          schedule={selectedSchedule}
        />
      </FormProvider>
    </>
  );
}
