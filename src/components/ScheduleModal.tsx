"use client";

import {Schedule} from "@/type/schedule";
import {format} from "date-fns";
import {useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useFormContext} from "react-hook-form";
import BPXPField from "./BPXPField";
import DepartmentSelectField from "./DepartmentSelectField";
import NumberField from "./NumberInput";
import ParkingSelectField from "./ParkingSelectField";
import {
  BottomStatusSelectField,
  CommonStatusSelectField,
  PaintStatusSelectField,
  PlateStatusSelectField,
  ReleaseStatusSelectField,
} from "./StatusSelectField";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleDelete: (data: Schedule | undefined) => void;
  onSubmit: (data: Schedule) => void;
  schedule: Schedule | undefined;
}

export default function ScheduleModal({
  visible,
  handleClose,
  handleDelete,
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

  if (!schedule) return null;
  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black opacity-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <div
          className={`bg-white p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border-4 ${
            schedule.id ? "border-amber-200" : "border-orange-500"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">{`스케줄 ${
            schedule.id ? "업데이트" : "등록"
          }`}</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4 text-sm"
          >
            <div className="col-span-4 font-semibold border-b pb-1">
              지점정보
            </div>
            <div>
              <label className="block mb-1">지점</label>
              <DepartmentSelectField />
            </div>
            <div>
              <label className="block mb-1">주차장</label>
              <ParkingSelectField />
            </div>
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
              <label className="block mb-1">출고예정일</label>
              <div className="w-full">
                <DatePicker
                  selected={
                    watch("release_expected_date")
                      ? new Date(watch("release_expected_date")!)
                      : null
                  }
                  onChange={(date) =>
                    setValue(
                      "release_expected_date",
                      date ? format(date, "yyyy-MM-dd") : null
                    )
                  }
                  className="border px-2 py-1 w-full"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="출고예정일"
                />
              </div>
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
              <label className="block mb-1">색상</label>
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
              <label className="block mb-1">차/대</label>
              <input
                {...register("charger")}
                className="border px-2 py-1 w-full"
                placeholder="EX: 삼성자차"
              />
            </div>
            <div>
              <label className="block mb-1">선견적</label>
              <NumberField
                name="estimate"
                className="border px-2 py-1 w-full"
                placeholder="EX: 250000"
              />
            </div>
            <div>
              <label className="block mb-1">작업자</label>
              <input
                {...register("worker")}
                className="border px-2 py-1 w-full"
                placeholder="김아무개"
              />
            </div>
            <div className="col-span-4 font-semibold border-b pt-2 pb-1">
              작업상태
            </div>
            <div>
              <label className="block mb-1">판금상태</label>
              <PlateStatusSelectField />
            </div>
            <div>
              <label className="block mb-1">하지상태</label>
              <BottomStatusSelectField />
            </div>
            <div>
              <label className="block mb-1">도장상태</label>
              <PaintStatusSelectField />
            </div>
            <div>
              <label className="block mb-1">일반상태</label>
              <CommonStatusSelectField />
            </div>
            <div>
              <label className="block mb-1">출고상태</label>
              <ReleaseStatusSelectField />
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
              <BPXPField name="right_front_fender" label="R앞휀다" />
              <BPXPField name="right_front_door" label="R앞도어" />
              <BPXPField name="right_rear_door" label="R뒤도어" />
              <BPXPField name="right_rear_fender" label="R뒤휀다" />
              <BPXPField name="rear_bumper" label="뒤범퍼" />
              <BPXPField name="left_front_fender" label="L앞휀다" />
              <BPXPField name="left_front_door" label="L앞도어" />
              <BPXPField name="left_rear_door" label="L뒤도어" />
              <BPXPField name="left_rear_fender" label="L뒤휀다" />
              <BPXPField name="back_door" label="백도어" />
              <BPXPField name="bonnet" label="본네트" />
              <BPXPField name="hood" label="후드" />
              <BPXPField name="trunk" label="트렁크" />
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
                onClick={handleClose}
                className="w-30 h-10 bg-gray-400 text-white py-2 px-6 rounded shadow cursor-pointer"
              >
                닫기
              </button>
              {schedule.id && (
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(schedule);
                  }}
                  className="w-30 h-10 bg-red-600 text-white py-2 px-6 rounded shadow cursor-pointer"
                >
                  삭제
                </button>
              )}
              <button
                type="submit"
                className="w-30 h-10 bg-gray-900 text-white py-2 px-6 rounded shadow cursor-pointer"
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
