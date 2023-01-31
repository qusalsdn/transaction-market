import React, { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "phone" | "price";
  type: string;
  register: UseFormRegisterReturn;
  required: boolean;
}

export default function Input({
  label,
  name,
  kind = "text",
  type,
  register,
  required,
}: InputProps) {
  const [price, setPrice] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    const removeCommaValue: number = Number(value.replaceAll(",", ""));
    setPrice(removeCommaValue.toLocaleString("ko-KR"));
  };

  return (
    <div>
      <label className="mb-1 block text-gray-700" htmlFor={name}>
        {label}
      </label>

      {kind === "text" ? (
        <div className="relative flex items-center  rounded-md shadow-md">
          <input
            id={name}
            type={type}
            required={required}
            {...register}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400
             transition-colors focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>
      ) : null}

      {kind === "price" ? (
        <div className="relative flex items-center  rounded-md shadow-md">
          <div className="pointer-events-none absolute left-0 flex items-center justify-center pl-3">
            <span className="text-sm text-gray-500">￦</span>
          </div>
          <input
            id={name}
            type={type}
            required={required}
            {...register}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-7 placeholder-gray-400 
            transition-colors focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            onChange={onChange}
            value={price}
          />
          <div className="pointer-events-none absolute right-0 flex items-center pr-3">
            <span className="text-gray-500">KRW</span>
          </div>
        </div>
      ) : null}

      {kind === "phone" ? (
        <div className="flex rounded-md shadow-md">
          <span
            className="flex select-none items-center justify-center rounded-l-md border border-r-0 border-gray-300
             bg-gray-50 px-3 text-sm text-gray-500"
          >
            +82
          </span>
          <input
            id={name}
            type={type}
            required={required}
            {...register}
            className="w-full appearance-none rounded-md rounded-l-none border border-gray-300 px-3 py-2
             placeholder-gray-400 shadow-sm transition-colors focus:border-orange-500 focus:outline-none
              focus:ring-orange-500"
          />
        </div>
      ) : null}
    </div>
  );
}
