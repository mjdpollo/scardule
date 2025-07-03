import {Dispatch, Fragment, SetStateAction} from "react";
import {Schedule} from "../type/schedule";
import SchedulerScheduleRow from "./SchedulerScheduleRow";
export default function SchedulerTable({
  schedules,
  setSelectedSchedule,
  openModal,
}: {
  schedules: Schedule[];
  setSelectedSchedule: Dispatch<SetStateAction<Schedule>>;
  openModal: () => void;
}) {
  const groupByReleaseDate = schedules.reduce((acc, schedule) => {
    const dateKey = schedule.release_date || "미정";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="mt-12 max-w-7xl mx-auto">
      <table className="w-full border border-black text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black px-4 py-2"></th>
            <th className="border border-black px-4 py-2">차량번호</th>
            <th className="border border-black px-4 py-2">차종</th>
            <th className="border border-black px-4 py-2">작업내용</th>
            <th className="border border-black px-4 py-2">수리횟수</th>
            <th className="border border-black px-4 py-2">입고일</th>
            <th className="border border-black px-4 py-2">출고일</th>
            <th className="border border-black px-4 py-2">담당자</th>
            <th className="border border-black px-4 py-2">입고처</th>
            <th className="border border-black px-4 py-2">비고</th>
            <th className="border border-black px-4 py-2">색상코드</th>
            <th className="border border-black px-4 py-2">선견적</th>
            <th className="border border-black px-4 py-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupByReleaseDate).map(([date, rows]) => (
            <Fragment key={date.toString()}>
              <tr className="bg-white-100 font-bold text-center">
                <td colSpan={13} className="border border-black px-4 py-2">
                  {date}
                </td>
              </tr>
              {rows.map((schedule, index) => (
                <SchedulerScheduleRow
                  key={schedule.id}
                  schedule={schedule}
                  onClick={(schedule) => {
                    setSelectedSchedule(schedule);
                    openModal();
                  }}
                  index={index}
                />
              ))}
              <tr className="bg-yellow-100 font-bold text-center">
                <td colSpan={2} className="border border-black px-4 py-2">
                  {date}
                </td>
                <td colSpan={11} className="border border-black px-4 py-2 ">
                  {rows
                    .reduce((sum, s) => sum + (s.estimate || 0), 0)
                    .toLocaleString()}
                  원
                </td>
              </tr>
            </Fragment>
          ))}
          <tr className="bg-yellow-200 font-bold text-center">
            <td colSpan={2} className="border border-black px-4 py-2">
              총 {schedules.length} 건
            </td>
            <td colSpan={11} className="border border-black px-4 py-2">
              {`${schedules
                .reduce((sum, s) => sum + (s.estimate || 0), 0)
                .toLocaleString()} 원`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
