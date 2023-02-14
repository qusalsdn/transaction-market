import React, { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  label?: string;
  name?: string;
  register: UseFormRegisterReturn;
  beforeValue?: string;
  [key: string]: any;
}

export default function TextArea({
  label,
  name,
  register,
  beforeValue,
  ...rest
}: TextAreaProps) {
  const [text, setText] = useState<string | undefined>("");

  const onChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setText(value);
  };
  useEffect(() => {
    setText(beforeValue);
  }, [beforeValue]);

  return (
    <div>
      {label ? (
        <label htmlFor={name} className="mb-1 block font-medium text-gray-700">
          {label}
        </label>
      ) : null}

      <textarea
        id={name}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-orange-500
         focus:ring-orange-500"
        rows={4}
        {...register}
        {...rest}
        onChange={onChange}
        value={text}
      />
    </div>
  );
}
