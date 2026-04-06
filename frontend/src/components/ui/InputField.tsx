import React from "react";

type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  icon,
  rightElement,
  value,
  onChange,
  name,
}) => {
  const inputBase =
    "w-full bg-[#0c1c1c] border border-[#1a3030] focus:border-[#00d4aa]/55 focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/10 text-white placeholder-[#2d5050] rounded-[10px] py-2.5 text-[13px] transition-all duration-200";
  return (
    <>
      <label className="block text-[#7aafaf] text-[10px] font-semibold tracking-widest uppercase mb-1.5">
        {label}
      </label>

      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a6060] pointer-events-none flex">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`pl-9 pr-4 ${inputBase} ${rightElement ? "pr-11" : "pr-4"}`}
        />
        {/* Right Element */}
        {rightElement && (
          <div className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#3a6060] hover:text-[#00d4aa] transition-colors flex">
            {rightElement}
          </div>
        )}
      </div>
    </>
  );
};

export default InputField;
