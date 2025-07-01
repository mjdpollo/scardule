"use client";

import axios from "axios";
import qs from "qs";
import DatePicker from "react-datepicker";
import {useForm} from "react-hook-form";

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

export default function ScheduleFilterForm() {
  const {register, handleSubmit, setValue, watch, reset} = useForm();

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
    console.log(res);
  };

  const renderBooleanField = (name: string, label: string) => (
    <div>
      <label className="font-medium mr-2">{label}</label>
      <select {...register(name)} className="border px-2 py-1">
        <option value="">전체</option>
        <option value="true">O</option>
        <option value="false">X</option>
      </select>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-xl max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>입고일 이후</label>
          <DatePicker
            selected={watch("stock_date__gte") || null}
            onChange={(date) => setValue("stock_date__gte", date ?? undefined)}
            dateFormat="yyyy-MM-dd"
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>입고일 이전</label>
          <DatePicker
            selected={watch("stock_date__lte") || null}
            onChange={(date) => setValue("stock_date__lte", date ?? undefined)}
            dateFormat="yyyy-MM-dd"
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>출고일 이후</label>
          <DatePicker
            selected={watch("release_date__gte") || null}
            onChange={(date) =>
              setValue("release_date__gte", date ?? undefined)
            }
            dateFormat="yyyy-MM-dd"
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>출고일 이전</label>
          <DatePicker
            selected={watch("release_date__lte") || null}
            onChange={(date) =>
              setValue("release_date__lte", date ?? undefined)
            }
            dateFormat="yyyy-MM-dd"
            className="border px-2 py-1 w-full"
          />
        </div>

        <input
          {...register("car_model")}
          placeholder="차종"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("car_number")}
          placeholder="차량번호"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("color_code")}
          placeholder="컬러코드"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("supplier")}
          placeholder="입고처"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("charger")}
          placeholder="차/대"
          className="border px-2 py-1 w-full"
        />

        <input
          {...register("estimate__gte")}
          placeholder="선견적 이상"
          type="number"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("estimate__lte")}
          placeholder="선견적 이하"
          type="number"
          className="border px-2 py-1 w-full"
        />

        <input
          {...register("note")}
          placeholder="비고"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("status")}
          placeholder="상태"
          className="border px-2 py-1 w-full"
        />
        <input
          {...register("number_of_repairs")}
          placeholder="수리 개수 정확히 일치"
          type="number"
          className="border px-2 py-1 w-full"
        />

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

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          검색
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
          }}
          className="bg-gray-400 text-white py-2 px-4 rounded"
        >
          초기화
        </button>
      </div>
    </form>
  );
}
