import {Schedule, getStatusClassName} from "@/type/schedule";

interface Props {
  schedule: Schedule;
  openWorkerModal: (schedule: Schedule) => void;
  handleUpdatePlateStatus: (schedule: Schedule) => void;
  handleUpdatePaintStatus: (schedule: Schedule) => void;
  handleUpdateCommonStatus: (schedule: Schedule) => void;
  handleUpdateReleaseStatus: (schedule: Schedule) => void;
  index: number;
}

export default function UserScheduleRow({
  schedule,
  openWorkerModal,
  handleUpdatePlateStatus,
  handleUpdatePaintStatus,
  handleUpdateCommonStatus,
  handleUpdateReleaseStatus,
  index,
}: Props) {
  return (
    <tr className="relative group border-b text-center text-sm hover:bg-gray-50">
      <td className="border border-black text-base 1 py-1">
        {index + 1}
        {schedule.note && (
          <div className="absolute top-[-20px] left-[10px] mt-1 w-64 bg-yellow-100 text-black text-xs px-3 py-2 rounded shadow-md z-10 hidden group-hover:block">
            📝 {schedule.note}
          </div>
        )}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.car_number}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.car_model}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.working_content ?? "-"}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.number_of_repairs}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.stock_date ? formatMD(schedule.stock_date) : "-"}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.release_expected_date
          ? formatMD(schedule.release_expected_date)
          : "-"}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.charger}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.supplier}
      </td>
      <td className="border border-black text-base 1 py-1">
        {schedule.color_code}
      </td>
      <td
        className="border border-black text-base 1 py-1 cursor-pointer bg-amber-100"
        onClick={() => {
          openWorkerModal(schedule);
        }}
      >
        {schedule.worker}
      </td>
      <td
        className={`border border-black text-base 1 py-1 ${getStatusClassName(
          schedule.plate_status
        )} cursor-pointer`}
        onClick={() => {
          handleUpdatePlateStatus(schedule);
        }}
      >
        {schedule.plate_status}
      </td>
      <td
        className={`border border-black text-base 1 py-1 ${getStatusClassName(
          schedule.paint_status
        )} cursor-pointer`}
        onClick={() => {
          handleUpdatePaintStatus(schedule);
        }}
      >
        {schedule.paint_status}
      </td>
      <td
        className={`border border-black text-base 1 py-1 ${getStatusClassName(
          schedule.common_status
        )} cursor-pointer`}
        onClick={() => {
          handleUpdateCommonStatus(schedule);
        }}
      >
        {schedule.common_status}
      </td>
      <td
        className={`border border-black text-base 1 py-1 ${getStatusClassName(
          schedule.release_status
        )} cursor-pointer`}
        onClick={() => {
          handleUpdateReleaseStatus(schedule);
        }}
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
