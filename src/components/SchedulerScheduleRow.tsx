// components/SchedulerScheduleRow.tsx
import {Schedule, getStatusClassName} from "@/type/schedule";

interface Props {
  schedule: Schedule;
  onClick: (schedule: Schedule) => void;
  index: number;
}

export default function SchedulerScheduleRow({
  schedule,
  onClick,
  index,
}: Props) {
  return (
    <tr
      className="border-b text-center text-sm hover:bg-gray-50 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(schedule);
      }}
    >
      <td className="border border-black text-base px-2 py-1">{index + 1}</td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.car_number}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.car_model}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.working_content ?? "-"}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.number_of_repairs}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.stock_date ? formatMD(schedule.stock_date) : "-"}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.release_date ? formatMD(schedule.release_date) : "-"}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.charger}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.supplier}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.note ?? "-"}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.color_code}
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.estimate.toLocaleString()}원
      </td>
      <td className="border border-black text-base px-2 py-1">
        {schedule.worker}
      </td>
      <td
        className={`border border-black text-base px-2 py-1 ${getStatusClassName(
          schedule.plate_status
        )}`}
      >
        {schedule.plate_status}
      </td>
      <td
        className={`border border-black text-base px-2 py-1 ${getStatusClassName(
          schedule.paint_status
        )}`}
      >
        {schedule.paint_status}
      </td>
      <td
        className={`border border-black text-base px-2 py-1 ${getStatusClassName(
          schedule.common_status
        )}`}
      >
        {schedule.common_status}
      </td>
      <td
        className={`border border-black text-base px-2 py-1 ${getStatusClassName(
          schedule.release_status
        )}`}
      >
        {schedule.release_status}
      </td>
    </tr>
  );
}

function formatMD(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
