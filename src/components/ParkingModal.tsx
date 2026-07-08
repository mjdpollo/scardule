import {useEffect} from "react";
import {useFormContext} from "react-hook-form";
import {Schedule} from "../type/schedule";
import ParkingSelectField from "./ParkingSelectField";

interface Props {
  visible: boolean;
  handleClose: () => void;
  onSubmit: (data: Schedule) => void;
  schedule: Schedule | null;
}

export default function ParkingModal({
  visible,
  handleClose,
  onSubmit,
  schedule,
}: Props) {
  const {handleSubmit, reset} = useFormContext<Schedule>();

  useEffect(() => {
    if (schedule) {
      reset(schedule);
    }
  }, [schedule, reset]);

  if (!schedule) return null;
  if (!visible) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black opacity-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <div className="bg-white p-6 rounded-xl w-full max-w-2xs overflow-visible border-orange-500 border-4 text-center ">
          <h2 className="text-xl font-semibold mb-4">{`[${schedule.car_number}] 주차장 변경`}</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 text-sm"
          >
            <div className="relative ">
              <ParkingSelectField />
            </div>
            <div className="col-span-2 mt-4 flex justify-center gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-20 h-10 bg-gray-400 text-white py-2 px-6 rounded shadow cursor-pointer"
              >
                닫기
              </button>
              <button
                type="submit"
                className="w-20 h-10 bg-gray-900 text-white py-2 px-6 rounded shadow cursor-pointer"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
