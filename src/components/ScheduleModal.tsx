"use client";

import {Schedule} from "@/type/schedule";
import {format} from "date-fns";
import {useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useFormContext} from "react-hook-form";
import BPXPField from "./BPXPField";
import {StatusSelectField} from "./StatusSelectField";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Schedule) => void;
  schedule: Schedule;
}

export default function ScheduleModal({
  visible,
  onClose,
  onSubmit,
  schedule,
}: Props) {
  const {reset, watch, register, setValue, handleSubmit} =
    useFormContext<Schedule>();
  useEffect(() => {
    if (schedule) {
      reset(schedule);
    }
  }, [schedule, reset]);

  if (!visible) return null;

  const stockDate = watch("stock_date");
  const releaseDate = watch("release_date");
  console.log("StockDate : ", stockDate);
  console.log("ReleaseDate : ", releaseDate);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black opacity-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <div className="bg-white p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border-orange-500 border-4">
          <h2 className="text-xl font-semibold mb-4">{`스케줄 ${
            schedule.id ? "업데이트" : "등록"
          }`}</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4 text-sm"
          >
            <div className="col-span-4 font-semibold border-b pb-1">
              날짜정보
            </div>
            <div className="col-span-1">
              <label className="block mb-1">입고일</label>
              <DatePicker
                selected={
                  watch("stock_date") ? new Date(watch("stock_date")!) : null
                }
                onChange={(date) =>
                  setValue(
                    "stock_date",
                    date ? format(date, "yyyy-MM-dd") : null
                  )
                }
                className="border px-2 py-1 w-full"
                dateFormat="yyyy-MM-dd"
                placeholderText="입고일"
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">출고일</label>
              <div className="w-full">
                <DatePicker
                  selected={
                    watch("release_date")
                      ? new Date(watch("release_date")!)
                      : null
                  }
                  onChange={(date) =>
                    setValue(
                      "release_date",
                      date ? format(date, "yyyy-MM-dd") : null
                    )
                  }
                  className="border px-2 py-1 w-full"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="출고일"
                />
              </div>
            </div>

            <div className="col-span-4 font-semibold border-b pt-2 pb-1">
              차량정보
            </div>
            <div>
              <label className="block mb-1">차종</label>
              <input
                {...register("car_model")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 아반떼"
              />
            </div>
            <div>
              <label className="block mb-1">차량번호</label>
              <input
                {...register("car_number")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 12가3456"
              />
            </div>
            <div>
              <label className="block mb-1">색상코드</label>
              <input
                {...register("color_code")}
                className="border px-2 py-1 w-full"
                placeholder="EX: W4"
              />
            </div>

            <div className="col-span-4 font-semibold border-b pt-2 pb-1">
              입고정보
            </div>
            <div>
              <label className="block mb-1">입고처</label>
              <input
                {...register("supplier")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 서울지점"
              />
            </div>
            <div>
              <label className="block mb-1">담당자</label>
              <input
                {...register("charger")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 홍길동"
              />
            </div>
            <div>
              <label className="block mb-1">선견적</label>
              <input
                type="number"
                {...register("estimate", {valueAsNumber: true})}
                className="border px-2 py-1 w-full"
                placeholder="EX: 250000"
              />
            </div>
            <div>
              <label className="block mb-1">상태</label>
              <StatusSelectField />
            </div>

            <div className="col-span-4 font-semibold border-b pt-2 pb-1">
              작업내용
            </div>
            <div className="col-span-4">
              <label className="block mb-1">작업내용</label>
              <textarea
                {...register("content")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 앞범퍼 수리 및 본네트 도색"
              />
            </div>

            <div className="col-span-4 grid grid-cols-5 gap-4">
              <BPXPField name="front_bumper" label="앞범퍼" />
              <BPXPField name="left_front_fender" label="L앞펜더" />
              <BPXPField name="right_front_fender" label="R앞펜더" />
              <BPXPField name="left_front_door" label="L앞도어" />
              <BPXPField name="right_front_door" label="R앞도어" />
              <BPXPField name="left_rear_door" label="L뒷도어" />
              <BPXPField name="right_rear_door" label="R뒷도어" />
              <BPXPField name="left_rear_fender" label="L뒷펜더" />
              <BPXPField name="right_rear_fender" label="R뒷펜더" />
              <BPXPField name="rear_bumper" label="뒷범퍼" />
              <BPXPField name="rear_door" label="백도어" />
              <BPXPField name="bonnet" label="본네트" />
              <BPXPField name="hood" label="후드" />
            </div>

            <div className="col-span-4">
              <label className="block mb-1">비고</label>
              <textarea
                {...register("note")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 고객 요청사항 있음"
              />
            </div>

            <div className="col-span-4 mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-30 h-10 bg-gray-400 text-white py-2 px-6 rounded shadow"
              >
                닫기
              </button>
              <button
                type="submit"
                className="w-30 h-10 bg-gray-900 text-white py-2 px-6 rounded shadow"
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
