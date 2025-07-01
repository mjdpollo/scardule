"use client";

import axios from "axios";
import qs from "qs";
import {useForm} from "react-hook-form";

import SchedulerScheduleRow from "@/components/SchedulerScheduleRow";
import {Schedule} from "@/type/schedule";
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function ScheduleFilterFeidls() {
  const {register, handleSubmit, setValue, watch, reset} = useForm();
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const onSubmit = async (data: FilterFormData) => {
    const query = qs.stringify(data, {
      skipNulls: true,
      allowDots: true,
      filter: (_, value) =>
        value instanceof Date ? value.toISOString().slice(0, 10) : value,
    });

    const res = await axios.get(
      `http://localhost:8000/api/schedules/?${query}`
    );
    console.log(res.data);
    setSchedules(res.data);
  };

  useEffect(() => {
    onSubmit({}); // fetch all schedules by default
  }, []);

  const renderBooleanField = (name: string, label: string) => (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <select {...register(name)} className="border px-2 py-1">
        <option value="">전체</option>
        <option value="true">O</option>
        <option value="false">X</option>
      </select>
    </div>
  );

  const groupByReleaseDate = schedules.reduce((acc, schedule) => {
    const dateKey = schedule.release_date || "미정";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-xl max-w-4xl mx-auto bg-white shadow-md"
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
            <div className="col-span-2">
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
          </div>
        </div>

        {/* 차량 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">차량 정보</h2>
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
          <h2 className="text-lg font-semibold mb-2">입고 정보</h2>
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
            <div className="col-span-3">
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
          <div className="col-span-4">
            <label className="block mb-1">작업내용</label>
            <textarea
              {...register("content")}
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
            <div>
              <label className="block mb-1">상태</label>
              <input
                {...register("status")}
                placeholder="EX: 대기"
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

        {/* 부위 필터 */}
        <div className="grid grid-cols-5 gap-4">
          {renderBooleanField("front_bumber", "앞범퍼")}
          {renderBooleanField("left_front_fender", "L앞펜더")}
          {renderBooleanField("right_front_fender", "R앞펜더")}
          {renderBooleanField("left_front_door", "L앞도어")}
          {renderBooleanField("right_front_door", "R앞도어")}
          {renderBooleanField("left_rear_door", "L뒷도어")}
          {renderBooleanField("right_rear_door", "R뒷도어")}
          {renderBooleanField("left_rear_fender", "L뒷펜더")}
          {renderBooleanField("right_rear_fender", "R뒷펜더")}
          {renderBooleanField("rear_bumper", "뒷범퍼")}
          {renderBooleanField("rear_door", "백도어")}
          {renderBooleanField("bonnet", "본네트")}
          {renderBooleanField("hood", "후드")}
        </div>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded shadow"
          >
            검색
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
            }}
            className="bg-gray-400 text-white py-2 px-6 rounded shadow"
          >
            초기화
          </button>
        </div>
      </form>

      <div className="mt-12 max-w-7xl mx-auto">
        <table className="w-full border border-black text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-4 py-2">차량번호</th>
              <th className="border border-black px-4 py-2">차종</th>
              <th className="border border-black px-4 py-2">내용</th>
              <th className="border border-black px-4 py-2">수리횟수</th>
              <th className="border border-black px-4 py-2">입고일</th>
              <th className="border border-black px-4 py-2">출고일</th>
              <th className="border border-black px-4 py-2">담당자</th>
              <th className="border border-black px-4 py-2">입고처</th>
              <th className="border border-black px-4 py-2">비고</th>
              <th className="border border-black px-4 py-2">색상코드</th>
              <th className="border border-black px-4 py-2">선견적</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupByReleaseDate).map(([date, rows]) => (
              <>
                {rows.map((schedule) => (
                  <SchedulerScheduleRow key={schedule.id} schedule={schedule} />
                ))}
                <tr className="bg-yellow-100 font-bold text-right">
                  <td colSpan={10} className="border border-black px-4 py-2">
                    출고일 {date} 총 선견적
                  </td>
                  <td className="border border-black px-4 py-2 text-center">
                    {rows
                      .reduce((sum, s) => sum + (s.estimate || 0), 0)
                      .toLocaleString()}
                    원
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
