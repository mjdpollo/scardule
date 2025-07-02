// BPXPField.tsx
import {WithSelectField} from "@/components/WithSelectField";
import {BPXP} from "@/type/schedule";

const options = [
  {value: "", label: "-"},
  {value: BPXP.BP, label: "BP"},
  {value: BPXP.XP, label: "XP"},
];

export default function BPXPField({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const Field = WithSelectField(name, options);
  return (
    <>
      <div className="col-span-1">
        <label className="block mb-1">{label}</label>
        <Field />
      </div>
    </>
  );
}
