// StatusSelectField.tsx
import {WithSelectField} from "@/components/WithSelectField";
import {DEPARTMENT} from "@/type/schedule";

const options = [
  {value: "", label: "-"},
  {value: DEPARTMENT.SCAR, label: "SCAR"},
  {value: DEPARTMENT.BUNDANG, label: "남분당"},
];

const DepartmentSelectField = WithSelectField("department", options);

export default DepartmentSelectField;
