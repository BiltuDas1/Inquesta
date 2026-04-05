import React from "react";

type InputFieldProps = {
    label: string;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
};

const InputField: React.FC<InputFieldProps> = ({label, type = "text", placeholder, icon, value, onChange, name}) => {
    const inputBase =
        "w-full bg-[#0c1c1c] border border-[#1a3030] focus:border-[#00d4aa]/55 focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/10 text-white placeholder-[#2d5050] rounded-[10px] py-2.5 text-[13px] transition-all duration-200";
    return (
        <div className="mb-2.5">
            <label className="block text-[#7aafaf] text-[10px] font-semibold tracking-widest uppercase mb-1.5">
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a6060] pointer-events-none flex">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`pl-9 pr-4 ${inputBase}`}
                />
            </div>
        </div>
    );
};

export default InputField;
