"use client";

import {Schedule} from "@/type/schedule";
import {useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useForm} from "react-hook-form";

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
  const {register, handleSubmit, setValue, watch, reset} = useForm<Schedule>({
    defaultValues: schedule,
  });

  useEffect(() => {
    if (schedule) {
      reset(schedule);
    }
  }, [schedule, reset]);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{`스케줄 ${
          schedule.id ? "업데이트" : "등록"
        }`}</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-4 text-sm"
        >
          <div className="col-span-4 font-semibold border-b pb-1">날짜정보</div>
          <div className="col-span-1">
            <label className="block mb-1">입고일</label>
            <DatePicker
              selected={
                watch("stock_date") ? new Date(watch("stock_date")!) : null
              }
              onChange={(date) =>
                setValue("stock_date", date?.toISOString().slice(0, 10) ?? null)
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
                    date?.toISOString().slice(0, 10) ?? null
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
            <input
              {...register("status")}
              className="border px-2 py-1 w-full"
              placeholder="EX: 대기"
            />
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

          <div className="col-span-4 grid grid-cols-4 gap-4">
            {[
              "front_bumper",
              "left_front_fender",
              "right_front_fender",
              "left_front_door",
              "right_front_door",
              "left_rear_door",
              "right_rear_door",
              "left_rear_fender",
              "right_rear_fender",
              "rear_bumper",
              "rear_door",
              "bonnet",
              "hood",
            ].map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" {...register(key as keyof Schedule)} />
                {labelMap[key as keyof Schedule]}
              </label>
            ))}
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
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelMap: Record<keyof Schedule, string> = {
  id: "ID",
  stock_date: "입고일",
  release_date: "출고일",
  car_model: "차종",
  car_number: "차량번호",
  color_code: "색상코드",
  supplier: "입고처",
  charger: "담당자",
  content: "작업내용",
  working_content: "작업내용",
  estimate: "선견적",
  note: "비고",
  status: "상태",
  front_bumper: "앞범퍼",
  left_front_fender: "L앞펜더",
  right_front_fender: "R앞펜더",
  left_front_door: "L앞도어",
  right_front_door: "R앞도어",
  left_rear_door: "L뒷도어",
  right_rear_door: "R뒷도어",
  left_rear_fender: "L뒷펜더",
  right_rear_fender: "R뒷펜더",
  rear_bumper: "뒷범퍼",
  rear_door: "백도어",
  bonnet: "본네트",
  hood: "후드",
  number_of_repairs: "수리개수",
};
