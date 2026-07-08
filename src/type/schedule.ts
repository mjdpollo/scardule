export type Schedule = {
  id: number | null;
  stock_date: string | null;
  release_expected_date: string | null;
  release_date: string | null;
  department: DEPARTMENT | null;

  car_model: string | null;
  car_number: string | null;
  color_code: string | null;
  supplier: string | null;
  charger: string | null;
  content: string | null;
  working_content: string | null;
  estimate: number | null;
  note: string | null;

  front_bumper: BPXP | null;
  left_front_fender: BPXP | null;
  right_front_fender: BPXP | null;
  left_front_door: BPXP | null;
  right_front_door: BPXP | null;
  left_rear_door: BPXP | null;
  right_rear_door: BPXP | null;
  left_rear_fender: BPXP | null;
  right_rear_fender: BPXP | null;
  rear_bumper: BPXP | null;
  back_door: BPXP | null;
  bonnet: BPXP | null;
  hood: BPXP | null;
  trunk: BPXP | null;

  number_of_repairs: number | null;

  component: string | null;
  parking: PARKING | null;
  worker: string | null;

  plate_status: STATUS;
  bottom_status: STATUS;
  paint_status: STATUS;
  common_status: STATUS;
  release_status: STATUS;
};

export type WorkerPatchData = {
  worker: string;
};

export type PlateStatusPatchData = {
  plate_status: STATUS;
};

export type PaintStatusPatchData = {
  paint_status: STATUS;
};

export type CommonStatusPatchData = {
  common_status: STATUS;
};

export type ReleaseStatusPatchData = {
  release_status: STATUS;
};

export enum BPXP {
  BP = "BP",
  XP = "XP",
}

export enum STATUS {
  EMERGENCY = "응급",
  WAIT = "대기",
  COMPLETE = "완료",
}

export enum DEPARTMENT {
  SCAR = "SCAR",
  BUNDANG = "남분당",
}

export enum PARKING {
  B1 = "B1",
  F1 = "1F",
  F2 = "2F",
  F3 = "3F",
}

export const creatingSchuedule: Schedule = {
  id: null,
  stock_date: null,
  release_expected_date: null,
  release_date: null,
  department: null,
  car_model: "",
  car_number: "",
  color_code: "",
  supplier: "",
  charger: "",
  content: "",
  working_content: null,
  estimate: null,
  note: "",
  front_bumper: null,
  left_front_fender: null,
  right_front_fender: null,
  left_front_door: null,
  right_front_door: null,
  left_rear_door: null,
  right_rear_door: null,
  left_rear_fender: null,
  right_rear_fender: null,
  rear_bumper: null,
  back_door: null,
  bonnet: null,
  hood: null,
  trunk: null,
  number_of_repairs: 0,
  component: "",
  parking: null,
  worker: "",
  plate_status: STATUS.WAIT,
  bottom_status: STATUS.WAIT,
  paint_status: STATUS.WAIT,
  common_status: STATUS.WAIT,
  release_status: STATUS.WAIT,
};

export function getToggledStatus(status: STATUS): STATUS {
  if (status === STATUS.COMPLETE) {
    return STATUS.WAIT;
  } else if (status === STATUS.WAIT) {
    return STATUS.COMPLETE;
  } else {
    return status;
  }
}
export function getStatusClassName(status: STATUS) {
  switch (status) {
    case STATUS.EMERGENCY:
      return "emergency_status";
    case STATUS.WAIT:
      return "wait_status";
    case STATUS.COMPLETE:
      return "complete_status";
    default:
      return "";
  }
}

export function groupSchedulesByReleaseExpectingDate(
  schedules: Schedule[]
): Record<string, Schedule[]> {
  return schedules.reduce((acc, schedule) => {
    const dateKey = schedule.release_expected_date || "미정";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);
}

export function sortedGroupedSchedulesByReleaseExpectingDate(
  schedules: Schedule[]
): [string, Schedule[]][] {
  const grouped: Record<string, Schedule[]> = schedules.reduce(
    (acc, schedule) => {
      const dateKey = schedule.release_expected_date || "미정";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(schedule);
      return acc;
    },
    {} as Record<string, Schedule[]>
  );

  // Sort each group by release_date (inside the group)
  for (const date in grouped) {
    grouped[date].sort((a, b) => {
      const aTime = a.release_date
        ? new Date(a.release_date).getTime()
        : Infinity;
      const bTime = b.release_date
        ? new Date(b.release_date).getTime()
        : Infinity;
      return aTime - bTime;
    });
  }
  // Return entries sorted by the dateKey
  return Object.entries(grouped).sort(([dateA], [dateB]) => {
    if (dateA === "미정") return 1;
    if (dateB === "미정") return -1;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
}
