import {WithSelectField} from "@/components/WithSelectField";
import {PARKING} from "@/type/schedule";

const options = [
  {value: "", label: "-"},
  {value: PARKING.B1, label: "B1"},
  {value: PARKING.F1, label: "1F"},
  {value: PARKING.F2, label: "2F"},
  {value: PARKING.F3, label: "3F"},
];

const ParkingSelectField = WithSelectField("parking", options);

export default ParkingSelectField;
