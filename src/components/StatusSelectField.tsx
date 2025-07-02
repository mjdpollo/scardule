// StatusSelectField.tsx
import {WithSelectField} from "@/components/WithSelectField";
import {STATUS} from "@/type/schedule";

const options = [
  {value: "", label: "-"},
  {value: STATUS.EMERGENCY, label: "응급"},
  {value: STATUS.WAIT, label: "대기"},
  {value: STATUS.WORKING, label: "작업중"},
  {value: STATUS.COMPLETE, label: "완료"},
];

export const StatusSelectField = WithSelectField("status", options);
