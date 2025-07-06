"use client";

import BPXPField from "@/components/BPXPField";
import {getQueryFromFormData, getScarTechURL} from "@/utility/utility";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid"; // 또는 24/solid
import axios from "axios";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useFormContext} from "react-hook-form";
import {
  CommonStatusSelectField,
  PaintStatusSelectField,
  PlateStatusSelectField,
  ReleaseStatusSelectField,
} from "./StatusSelectField";

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
  note?: string;
  content?: string;
  estimate__gte?: number;
  estimate__lte?: number;
  number_of_repairs?: number;

  front_bumper?: string;
  left_front_fender?: string;
  right_front_fender?: string;
  left_front_door?: string;
  right_front_door?: string;
  left_rear_door?: string;
  right_rear_door?: string;
  left_rear_fender?: string;
  right_rear_fender?: string;
  rear_bumper?: string;
  back_door?: string;
  bonnet?: string;
  hood?: string;

  worker?: string;
  plate_status?: string;
  paint_status?: string;
  common_status?: string;
  release_status?: string;
};

export const filterResetData: FilterFormData = {
  release_date__gte: new Date(),
};

export default function ScheduleFilterFeidls({
  handleSearch,
}: {
  handleSearch: () => Promise<void>;
}) {
  const {reset, watch, register, setValue, getValues, handleSubmit} =
    useFormContext<FilterFormData>();
  const [enabledDetailSearch, setEnabledDetailSearch] =
    useState<boolean>(false);

  const handleDownload = async () => {
    const data = getValues();
    const query = getQueryFromFormData(data);

    const url = `${getScarTechURL()}/download_schedule/?${query}`;

    try {
      const res = await axios.get(url, {
        responseType: "blob", // ✅ 중요!
      });

      const blob = new Blob([res.data], {type: "text/csv;charset=utf-8;"});
      const link = document.createElement("a");

      const blobUrl = window.URL.createObjectURL(blob);
      link.href = blobUrl;
      link.setAttribute("download", `schedules_${query}.csv`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // 메모리 해제
    } catch (error) {
      console.error("다운로드 실패", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className="p-6 border rounded-xl max-w-7xl mx-auto bg-white shadow-md"
    >
      {/* 출고 정보 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">출고 정보</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block mb-1">출고일 이후</label>
            <DatePicker
              selected={watch("release_date__gte") || null}
              onChange={(date) =>
                setValue("release_date__gte", date ?? undefined)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="EX: 2025-06-01"
              className="border px-2 py-1 w-full"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-1">출고일 이전</label>
            <DatePicker
              selected={watch("release_date__lte") || null}
              onChange={(date) =>
                setValue("release_date__lte", date ?? undefined)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="EX: 2025-06-30"
              className="border px-2 py-1 w-full"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-1">출고상태</label>
            <ReleaseStatusSelectField />
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setEnabledDetailSearch((prev) => !prev)}
      >
        <h2 className="text-lg font-semibold my-3">상세 검색</h2>
        <span className="ml-1">
          {enabledDetailSearch ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          )}
        </span>
      </div>
      <hr />

      <div
        className={`p-1 overflow-hidden transition-all duration-300 ${
          enabledDetailSearch ? "max-h-250 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div>
          <h2 className="text-lg font-semibold my-2">차량 정보</h2>
          <hr className="mb-1" />
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block mb-1">차종</label>
              <input
                {...register("car_model")}
                placeholder="EX: 아반떼"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">차량번호</label>
              <input
                {...register("car_number")}
                placeholder="EX: 123가4567"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">컬러코드</label>
              <input
                {...register("color_code")}
                placeholder="EX: W4"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
        </div>
        {/* 입고 정보 */}
        <div>
          <h2 className="text-lg font-semibold my-2">입고 정보</h2>
          <hr className="mb-1" />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-1">
              <label className="block mb-1">입고일 이후</label>
              <DatePicker
                selected={watch("stock_date__gte") || null}
                onChange={(date) =>
                  setValue("stock_date__gte", date ?? undefined)
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="EX: 2025-06-01"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">입고일 이전</label>
              <DatePicker
                selected={watch("stock_date__lte") || null}
                onChange={(date) =>
                  setValue("stock_date__lte", date ?? undefined)
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
                {...register("supplier")}
                placeholder="EX: 서울지점"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">차/대</label>
              <input
                {...register("charger")}
                placeholder="EX: 홍길동"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">수리 개수</label>
              <input
                {...register("number_of_repairs")}
                placeholder="EX: 3"
                type="number"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold my-2">작업 내용</h2>
            <hr className="mb-1" />
            <div className="col-span-4">
              <div className="grid grid-cols-5 gap-4">
                <BPXPField name="front_bumper" label="앞범퍼" />
                <BPXPField name="left_front_fender" label="L앞휀다" />
                <BPXPField name="right_front_fender" label="R앞휀다" />
                <BPXPField name="left_front_door" label="L앞도어" />
                <BPXPField name="right_front_door" label="R앞도어" />
                <BPXPField name="left_rear_door" label="L뒤도어" />
                <BPXPField name="right_rear_door" label="R뒤도어" />
                <BPXPField name="left_rear_fender" label="L뒤휀다" />
                <BPXPField name="right_rear_fender" label="R뒤휀다" />
                <BPXPField name="rear_bumper" label="뒤범퍼" />
                <BPXPField name="back_door" label="백도어" />
                <BPXPField name="bonnet" label="본네트" />
                <BPXPField name="hood" label="후드" />
                <BPXPField name="trunk" label="트렁크" />
              </div>
              <div className="cols-span-5 mt-4">
                <label className="block mb-1">작업내용</label>
                <textarea
                  {...register("content")}
                  placeholder="EX: 앞범퍼 및 본네트 수리"
                  className="border px-2 py-1 w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold my-2">작업상태</h2>
          <hr className="mb-1" />
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block mb-1">판금상태</label>
              <PlateStatusSelectField />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">도장상태</label>
              <PaintStatusSelectField />
            </div>
            <div>
              <label className="block mb-1">일반상태</label>
              <CommonStatusSelectField />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">출고상태</label>
              <CommonStatusSelectField />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold my-2">기타</h2>
          <hr className="mb-1" />
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block mb-1">선견적 이상</label>
              <input
                {...register("estimate__gte")}
                placeholder="EX: 300000"
                type="number"
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">선견적 이하</label>
              <input
                {...register("estimate__lte")}
                placeholder="EX: 800000"
                type="number"
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-1">비고</label>
            <input
              {...register("note")}
              placeholder="EX: 고객 요청사항 있음"
              className="border px-2 py-1 w-full"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6 justify-end">
        <button
          type="button"
          onClick={() => {
            reset(filterResetData);
          }}
          className="w-30 h-10 bg-gray-400 text-white py-2 px-6 rounded shadow cursor-pointer"
        >
          초기화
        </button>
        <button
          onClick={handleDownload}
          className="w-30 h-10 bg-emerald-600 text-white py-2 px-6 rounded shadow cursor-pointer"
        >
          다운로드
        </button>
        <button
          type="submit"
          className="w-30 h-10 bg-blue-600 text-white py-2 px-6 rounded shadow cursor-pointer"
        >
          검색
        </button>
      </div>
    </form>
  );
}
