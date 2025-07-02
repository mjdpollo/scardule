// StatusSelectField.tsx
import {WithSelectField} from "@/components/WithSelectField";

const options = [
  {value: "", label: "-"},
  {value: "대기", label: "대기"},
  {value: "완료", label: "완료"},
];

export const StatusSelectField = WithSelectField("status", options);
