// components/UserScheduleRow.tsx
import {getStatusClassName} from "@/app/utility/utility";
import {Schedule} from "@/type/schedule";

interface Props {
  schedule: Schedule;
  onClick: (schedule: Schedule) => void;
  index: number;
}

export default function UserScheduleRow({schedule, onClick, index}: Props) {
  return (
    <tr
      className="border-b text-center text-sm hover:bg-gray-50"
      onClick={(e) => {
        e.preventDefault();
        console.log(schedule);
        onClick?.(schedule);
      }}
    >
      <td className="border border-black text-base px-4 py-3">{index + 1}</td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.car_number}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.car_model}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.working_content ?? "-"}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.number_of_repairs}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.stock_date ? formatMD(schedule.stock_date) : "-"}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.release_date ? formatMD(schedule.release_date) : "-"}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.charger}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.supplier}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.note ?? "-"}
      </td>
      <td className="border border-black text-base px-4 py-3">
        {schedule.color_code}
      </td>
      <td
        className={`border border-black text-base px-4 py-3 ${getStatusClassName(
          schedule.status
        )}`}
      >
        {schedule.status}
      </td>
    </tr>
  );
}

function formatMD(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
