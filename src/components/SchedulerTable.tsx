import {Dispatch, Fragment, SetStateAction} from "react";
import {
  Schedule,
  sortedGroupedSchedulesByReleaseExpectingDate,
} from "../type/schedule";
import SchedulerScheduleRow from "./SchedulerScheduleRow";

import {parseISO} from "date-fns";
import SchedulerTableHeader from "./SchedulerTableHeader";
function getKoreanDayOfWeek(dateStr: string): string {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const date = parseISO(dateStr);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  return dayNames[day];
}

export default function SchedulerTable({
  schedules,
  setSelectedSchedule,
  openModal,
}: {
  schedules: Schedule[];
  setSelectedSchedule: Dispatch<SetStateAction<Schedule | undefined>>;
  openModal: () => void;
}) {
  const groupByReleaseDate =
    sortedGroupedSchedulesByReleaseExpectingDate(schedules);

  return (
    <div className="max-w-7xl mx-auto">
      <table className="table-fixed w-full border border-black text-sm">
        <SchedulerTableHeader />
        <tbody>
          {groupByReleaseDate.map(([date, rows]) => (
            <Fragment key={date.toString()}>
              <tr className="bg-white-100 font-bold text-center">
                <td colSpan={16} className="border border-black px-2 py-2">
                  {`${date} (${getKoreanDayOfWeek(date)})`}
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
                <td colSpan={2} className="border border-black px-2 py-2">
                  {date}
                </td>
                <td colSpan={14} className="border border-black px-2 py-2 ">
                  {rows
                    .reduce((sum, s) => sum + (s.estimate || 0), 0)
                    .toLocaleString()}
                  원
                </td>
              </tr>
            </Fragment>
          ))}
          <tr className="bg-yellow-200 font-bold text-center">
            <td colSpan={2} className="border border-black px-2 py-2">
              총 {schedules.length} 건
            </td>
            <td colSpan={14} className="border border-black px-2 py-2">
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
