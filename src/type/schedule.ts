export type Schedule = {
  id: number | null;
  stock_date: string | null;
  release_date: string | null;
  car_model: string;
  car_number: string;
  color_code: string;
  supplier: string;
  charger: string;
  content: string | null;
  working_content: string | null;
  estimate: number;
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
  rear_door: BPXP | null;
  bonnet: BPXP | null;
  hood: BPXP | null;

  number_of_repairs: number | null;

  worker: string;
  plate_status: STATUS;
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

export function getToggledStatus(status: STATUS): STATUS {
  if (status === STATUS.COMPLETE) {
    return STATUS.WAIT;
  } else if (status === STATUS.WAIT) {
    return STATUS.COMPLETE;
  } else {
    return status;
  }
}
