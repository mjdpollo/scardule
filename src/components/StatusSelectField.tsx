// StatusSelectField.tsx
import {WithSelectField} from "@/components/WithSelectField";
import {STATUS} from "@/type/schedule";

const options = [
  {value: "", label: "-"},
  {value: STATUS.EMERGENCY, label: "응급"},
  {value: STATUS.WAIT, label: "대기"},
  {value: STATUS.COMPLETE, label: "완료"},
];

export const PlateStatusSelectField = WithSelectField("plate_status", options);
export const PaintStatusSelectField = WithSelectField("paint_status", options);
export const CommonStatusSelectField = WithSelectField(
  "common_status",
  options
);
export const ReleaseStatusSelectField = WithSelectField(
  "release_status",
  options
);
