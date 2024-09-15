import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import { CaretDown, CheckCircle } from "@phosphor-icons/react";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

export type SelectOptionType = {
    value: string;
    label: string;
};

type SelectProps = {
    id: string;
    options: SelectOptionType[];
    value: SelectOptionType;
    onChange: (option: SelectOptionType) => void;
};

export default function Select({ id, options, value, onChange }: SelectProps) {
    return (
        <Listbox
            value={value}
            onChange={onChange}
            as="div"
            className="relative"
        >
            <ListboxButton
                id={id}
                className={twMerge(
                    "relative w-full py-2 pl-3 pr-10 rounded-lg cursor-default",
                    "bg-zinc-900 border-2 border-zinc-700",
                    "text-left font-medium",
                    "transition-colors",
                )}
            >
                <span className="block truncate">{value.label}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <CaretDown
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                    />
                </span>
            </ListboxButton>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-out duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <ListboxOptions
                    className={twMerge(
                        "absolute w-full mt-2 overflow-auto text-base max-h-60",
                        "bg-zinc-900 border-2 border-zinc-700 rounded-lg shadow-xl",
                    )}
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.value}
                            value={option}
                            className={({ focus }) =>
                                twMerge(
                                    focus
                                        ? "text-white bg-zinc-800"
                                        : "text-zinc-400",
                                    "cursor-default select-none relative py-2 pl-10 pr-4",
                                )
                            }
                        >
                            {({ selected }) => (
                                <>
                                    <span
                                        className={twMerge(
                                            selected
                                                ? "font-medium text-white"
                                                : "font-normal",
                                            "block truncate",
                                        )}
                                    >
                                        {option.label}
                                    </span>
                                    {selected && (
                                        <span
                                            className={twMerge(
                                                "text-white",
                                                "absolute inset-y-0 left-0 flex items-center pl-3",
                                            )}
                                        >
                                            <CheckCircle
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                                weight="bold"
                                            />
                                        </span>
                                    )}
                                </>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Transition>
        </Listbox>
    );
}
