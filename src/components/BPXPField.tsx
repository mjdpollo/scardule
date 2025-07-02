import {useFormContext} from "react-hook-form";

export default function BPXPField({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const {register} = useFormContext();
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <select {...register(name)} className="border px-2 py-1">
        <option value="">-</option>
        <option value="BP">BP</option>
        <option value="XP">XP</option>
      </select>
    </div>
  );
}
