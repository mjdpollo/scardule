"use client";
import {creatingSchuedule, Schedule} from "@/type/schedule";
import {getScarTechURL} from "@/utility/utility";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation"; // ✅ App Router용
import {useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import ScheduleModal from "./ScheduleModal";

export default function Header() {
  const router = useRouter(); // ← assign this!
  const [showModal, setShowModal] = useState(false);
  const CreatingScheduleForm = useForm<Schedule>({
    defaultValues: creatingSchuedule,
  });

  const handleCreatingSchedule = async (schedule: Schedule) => {
    console.log("💾 Saving schedule:", schedule);
    if (!schedule.id) {
      const res = await axios.post(
        `${getScarTechURL()}/api/schedules/`,
        schedule
      );
      if (res.status !== 201) {
        alert("에러가 발생했습니다.");
      }
    } else {
      alert("에러가 발생했습니다.");
    }
    closeCreatingScheduleModal();
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push(`${getScarTechURL()}/logout/`);
  };

  const openCreatingScheduleModal = () => setShowModal(true);
  const closeCreatingScheduleModal = () => setShowModal(false);

  const pathname = usePathname();

  const linkClass = (href: string = "") =>
    `w-30 h-10 px-4 py-2 mx-2 cursor-pointer hover:text-blue-800 ${
      pathname === href ? "font-black" : ""
    }`;

  return (
    <>
      <header className="fixed flex justify-center w-full h-[100] text-lg z-30 shadow bg-white">
        <div className="min-w-7xl flex justify-between">
          <div className="flex justify-start items-center font-bold text-center">
            <Link className="mr-5" href="/">
              <Image
                src="/scardule.png"
                alt="SCARDULE LOGO"
                width={190}
                height={65}
              />
            </Link>
            <button
              onClick={openCreatingScheduleModal}
              className="w-30 h-10 px-4 py-2 mx-2 cursor-pointer bg-scar-orange rounded hover:outline-2 hover:outline-amber-200"
            >
              일정등록
            </button>
            <Link href="/scheduler" className={linkClass("/scheduler")}>
              일정관리
            </Link>
            <Link href="/situation" className={linkClass("/situation")}>
              작업현황
            </Link>
          </div>
          <div className="flex items-center justify-between font-bold">
            <button className={linkClass("/logout")} onClick={handleLogout}>
              로그아웃
            </button>
            <Link className="cursor-pointer" href={getScarTechURL()}>
              <Image
                width={90}
                height={50}
                src="/scar_tech.png"
                alt="SCAR LOGO"
              />
            </Link>
          </div>
        </div>
      </header>
      <FormProvider {...CreatingScheduleForm}>
        <ScheduleModal
          visible={showModal}
          handleClose={closeCreatingScheduleModal}
          handleDelete={() => {}}
          onSubmit={handleCreatingSchedule}
          schedule={creatingSchuedule}
        />
      </FormProvider>
    </>
  );
}
