// withSelectField.tsx
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {Controller, useFormContext} from "react-hook-form";

type Option = {value: string; label: string};

export function WithSelectField(name: string, options: Option[]) {
  return function SelectField() {
    const {control} = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({field}) => {
          const selected =
            options.find((opt) => opt.value === field.value) ?? options[0];
          return (
            <Listbox value={field.value} onChange={field.onChange}>
              <div className="relative">
                <ListboxButton className="relative w-full cursor-pointer rounded border px-2 py-1 text-left bg-white">
                  <span>{selected.label}</span>
                  <span className="absolute inset-y-0 right-2 flex items-center">
                    <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
                  </span>
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 w-full rounded border bg-white shadow">
                  {options.map((opt) => (
                    <ListboxOption
                      key={opt.value}
                      value={opt.value}
                      className={({active}) =>
                        `px-3 py-1 cursor-pointer ${
                          active ? "bg-blue-100" : ""
                        }`
                      }
                    >
                      {({selected}) => (
                        <div className="flex justify-between">
                          <span>{opt.label}</span>
                          {selected && (
                            <CheckIcon className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          );
        }}
      />
    );
  };
}
