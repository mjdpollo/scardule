"use client";

import {FormProvider, useForm} from "react-hook-form";

import {getScarTechURL} from "@/app/utility/utility";
import {Schedule} from "@/type/schedule";
import axios from "axios";
import Link from "next/link";
import qs from "qs";
import {Dispatch, SetStateAction, useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BooleanField from "./BooleanField";

export type FilterFormData = {
  stock_date__gte?: Date;
  stock_date__lte?: Date;
  release_date__gte?: Date;
  release_date__lte?: Date;
  car_model?: string;
  car_number?: string;
  color_code?: string;
  supplier?: string;
  charger?: string;
  status?: string;
  note?: string;
  content?: string;
  estimate__gte?: number;
  estimate__lte?: number;
  number_of_repairs?: number;

  front_bumber?: string;
  left_front_fender?: string;
  right_front_fender?: string;
  left_front_door?: string;
  right_front_door?: string;
  left_rear_door?: string;
  right_rear_door?: string;
  left_rear_fender?: string;
  right_rear_fender?: string;
  rear_bumper?: string;
  rear_door?: string;
  bonnet?: string;
  hood?: string;
};

export default function ScheduleFilterFeidls({
  setSchedules,
  openCreateScheduleModal,
}: {
  setSchedules: Dispatch<SetStateAction<Schedule[]>>;
  openCreateScheduleModal: () => void;
}) {
  const methods = useForm();

  const handleQuery = async (data: FilterFormData) => {
    const query = qs.stringify(data, {
      skipNulls: true,
      allowDots: true,
      filter: (_, value) =>
        value instanceof Date ? value.toISOString().slice(0, 10) : value,
    });

    console.log(query);
    const res = await axios.get(`${getScarTechURL()}/api/schedules/?${query}`);
    setSchedules(res.data);
  };
  useEffect(() => {
    handleQuery({}); // fetch all schedules by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleQuery)}
        className="space-y-6 p-6 border rounded-xl max-w-4xl mx-auto bg-white shadow-md"
      >
        {/* 출고 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">출고 정보</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block mb-1">출고일 이후</label>
              <DatePicker
                selected={methods.watch("release_date__gte") || null}
                onChange={(date) =>
                  methods.setValue("release_date__gte", date ?? undefined)
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="EX: 2025-06-01"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">출고일 이전</label>
              <DatePicker
                selected={methods.watch("release_date__lte") || null}
                onChange={(date) =>
                  methods.setValue("release_date__lte", date ?? undefined)
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="EX: 2025-06-30"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* 차량 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">차량 정보</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block mb-1">차종</label>
              <input
                {...methods.register("car_model")}
                placeholder="EX: 아반떼"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">차량번호</label>
              <input
                {...methods.register("car_number")}
                placeholder="EX: 123가4567"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">컬러코드</label>
              <input
                {...methods.register("color_code")}
                placeholder="EX: W4"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* 입고 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">입고 정보</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-1">
              <label className="block mb-1">입고일 이후</label>
              <DatePicker
                selected={methods.watch("stock_date__gte") || null}
                onChange={(date) =>
                  methods.setValue("stock_date__gte", date ?? undefined)
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="EX: 2025-06-01"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">입고일 이전</label>
              <DatePicker
                selected={methods.watch("stock_date__lte") || null}
                onChange={(date) =>
                  methods.setValue("stock_date__lte", date ?? undefined)
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="EX: 2025-06-30"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="col-span-2"></div>
            <div>
              <label className="block mb-1">입고처</label>
              <input
                {...methods.register("supplier")}
                placeholder="EX: 서울지점"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">차/대</label>
              <input
                {...methods.register("charger")}
                placeholder="EX: 홍길동"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">수리 개수</label>
              <input
                {...methods.register("number_of_repairs")}
                placeholder="EX: 3"
                type="number"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
          <div className="col-span-4">
            <label className="block mb-1">작업내용</label>
            <textarea
              {...methods.register("content")}
              placeholder="EX: 앞범퍼 및 본네트 수리"
              className="border px-2 py-1 w-full"
            />
          </div>
        </div>

        {/* 기타 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">기타</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block mb-1">선견적 이상</label>
              <input
                {...methods.register("estimate__gte")}
                placeholder="EX: 300000"
                type="number"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">선견적 이하</label>
              <input
                {...methods.register("estimate__lte")}
                placeholder="EX: 800000"
                type="number"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">상태</label>
              <input
                {...methods.register("status")}
                placeholder="EX: 대기"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-1">비고</label>
            <input
              {...methods.register("note")}
              placeholder="EX: 고객 요청사항 있음"
              className="border px-2 py-1 w-full"
            />
          </div>
        </div>

        {/* 부위 필터 */}
        <div className="grid grid-cols-5 gap-4">
          <BooleanField name="front_bumber" label="앞범퍼" />
          <BooleanField name="left_front_fender" label="L앞펜더" />
          <BooleanField name="right_front_fender" label="R앞펜더" />
          <BooleanField name="left_front_door" label="L앞도어" />
          <BooleanField name="right_front_door" label="R앞도어" />
          <BooleanField name="left_rear_door" label="L뒷도어" />
          <BooleanField name="right_rear_door" label="R뒷도어" />
          <BooleanField name="left_rear_fender" label="L뒷펜더" />
          <BooleanField name="right_rear_fender" label="R뒷펜더" />
          <BooleanField name="rear_bumper" label="뒷범퍼" />
          <BooleanField name="rear_door" label="백도어" />
          <BooleanField name="bonnet" label="본네트" />
          <BooleanField name="hood" label="후드" />
        </div>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={openCreateScheduleModal}
            className="w-24 h-10 bg-orange-500 text-white px-4 py-2 rounded shadow"
          >
            스케줄 +
          </button>

          <button
            type="submit"
            className="w-24 h-10 bg-blue-600 text-white py-2 px-6 rounded shadow"
          >
            검색
          </button>
          <button
            type="button"
            onClick={() => {
              methods.reset();
            }}
            className="w-24 h-10 bg-gray-400 text-white py-2 px-6 rounded shadow"
          >
            초기화
          </button>
          <Link
            href="/user"
            className="w-24 h-10 bg-green-400 text-white py-2 px-6 rounded shadow"
          >
            TODAY
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
