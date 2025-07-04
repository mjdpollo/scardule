import {Controller, useFormContext} from "react-hook-form";

export default function NumberField({
  name,
  placeholder,
  className,
}: {
  name: string;
  placeholder: string;
  className: string;
}) {
  const {control} = useFormContext(); // ✅ Use shared context

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({field: {value, onChange, ...rest}}) => (
        <input
          {...rest}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={formatNumber(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
            onChange(raw);
          }}
          className={className}
        />
      )}
    />
  );
}

function formatNumber(value: string | number): string {
  if (!value) return "";
  return new Intl.NumberFormat("ko-KR").format(Number(value));
}
