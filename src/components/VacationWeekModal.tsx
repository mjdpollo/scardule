"use client";

import {Vacation} from "@/type/vacation";
import {api} from "@/utility/api";
import {
  addDays,
  addWeeks,
  endOfWeek,
  format,
  getDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {useEffect, useMemo, useState} from "react";

interface Props {
  visible: boolean;
  editable: boolean;
  handleClose: () => void;
}

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function VacationWeekModal({
  visible,
  editable,
  handleClose,
}: Props) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), {weekStartsOn: 1})
  );
  const [vacationsByDate, setVacationsByDate] = useState<
    Record<string, Vacation>
  >({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingDate, setSavingDate] = useState<string | null>(null);

  const weekEnd = useMemo(
    () => endOfWeek(weekStart, {weekStartsOn: 1}),
    [weekStart]
  );
  const days = useMemo(
    () => Array.from({length: 7}).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const fetchWeekVacations = async () => {
    try {
      const start = format(weekStart, "yyyy-MM-dd");
      const end = format(weekEnd, "yyyy-MM-dd");
      const res = await api.get(
        `/api/vacations/?date__gte=${start}&date__lte=${end}`
      );
      if (res.status !== 200) throw new Error("Failed to fetch vacations");
      const map: Record<string, Vacation> = {};
      (res.data as Vacation[]).forEach((v) => {
        map[v.date] = v;
      });
      setVacationsByDate(map);
      setDrafts((prevDrafts) => {
        const nextDrafts: Record<string, string> = {...prevDrafts};
        days.forEach((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          nextDrafts[dateStr] = map[dateStr]?.vacationers ?? "";
        });
        return nextDrafts;
      });
    } catch (err) {
      console.error(err);
      alert("휴가 정보를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    if (!visible) return;
    fetchWeekVacations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, weekStart.getTime()]);

  const handleSave = async (dateStr: string) => {
    if (savingDate) return;
    setSavingDate(dateStr);
    try {
      const res = await api.put(`/api/vacations/${dateStr}/`, {
        vacationers: (drafts[dateStr] ?? "").trim(),
      });
      if (res.status !== 200) throw new Error("Failed to save vacation");
      await fetchWeekVacations();
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSavingDate(null);
    }
  };

  const handleDelete = async (dateStr: string) => {
    if (savingDate) return;
    setSavingDate(dateStr);
    try {
      const res = await api.delete(`/api/vacations/${dateStr}/`);
      if (res.status !== 204) throw new Error("Failed to delete vacation");
      await fetchWeekVacations();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setSavingDate(null);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black opacity-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-lime-400">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setWeekStart((d) => subWeeks(d, 1))}
              className="w-10 h-10 cursor-pointer hover:text-blue-800 font-bold"
            >
              ◀
            </button>
            <h2 className="text-xl font-semibold">
              휴가관리 ({format(weekStart, "yyyy-MM-dd")} ~{" "}
              {format(weekEnd, "yyyy-MM-dd")})
            </h2>
            <button
              type="button"
              onClick={() => setWeekStart((d) => addWeeks(d, 1))}
              className="w-10 h-10 cursor-pointer hover:text-blue-800 font-bold"
            >
              ▶
            </button>
          </div>
          <table className="w-full table-fixed border-separate border-spacing-0 border-[0.5px] border-black text-sm">
            <thead>
              <tr className="bg-lime-100 text-center">
                <th className="border-[0.5px] border-black px-2 py-2 w-28 bg-lime-100!">
                  날짜
                </th>
                <th className="border-[0.5px] border-black px-2 py-2 bg-lime-100!">
                  휴가자
                </th>
                {editable && (
                  <th className="border-[0.5px] border-black px-2 py-2 w-32 bg-lime-100!">
                    관리
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const existing = vacationsByDate[dateStr];
                const isSaving = savingDate === dateStr;
                const weekdayLabel =
                  WEEKDAY_LABELS[(getDay(day) + 6) % 7];
                return (
                  <tr key={dateStr} className="text-center">
                    <td className="border-[0.5px] border-black px-2 py-2 font-semibold">
                      {format(day, "M/d")} ({weekdayLabel})
                    </td>
                    <td className="border-[0.5px] border-black px-2 py-1 text-left">
                      {editable ? (
                        <input
                          value={drafts[dateStr] ?? ""}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [dateStr]: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 w-full"
                          placeholder="EX: 김장현, 홍길동"
                        />
                      ) : (
                        <span>{existing?.vacationers || "-"}</span>
                      )}
                    </td>
                    {editable && (
                      <td className="border-[0.5px] border-black px-2 py-1">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSave(dateStr)}
                            className="px-3 py-1 bg-gray-900 text-white rounded shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            disabled={isSaving || !existing?.id}
                            onClick={() => handleDelete(dateStr)}
                            className="px-3 py-1 bg-red-600 text-white rounded shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!editable && (
            <p className="text-sm text-gray-500 mt-2">
              조회 권한만 있습니다. 휴가 정보를 수정하려면 관리자에게
              문의하세요.
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-30 h-10 bg-gray-400 text-white py-2 px-6 rounded shadow cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
