// interface inputType{
//     label: string,
//     placeholder: string,
//     onChange:(e:any) => void
// }
// const InputBox = ({label, placeholder, onChange}: inputType) => {
//     return (
//         <div>
//             <div className="text-sm font-medium text-left py-2">
//               {label}
//             </div>
//             <input 
//             placeholder={placeholder} 
//             onChange={onChange}
//             className="w-full px-2 py-1 border rounded border-slate-200"
//             type="text" />
//         </div>
//     );
// };

// export default InputBox;



import React from "react";

interface InputType {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
  error?: string;
}

const InputBox = ({
  label,
  placeholder,
  onChange,
  type = "text",
  onKeyDown,
  icon,
  rightIcon,
  value,
  error
}: InputType) => {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
          className={`w-full px-2 py-2 border rounded ${
            error ? "border-red-300 bg-red-50" : "border-slate-200"
          } ${icon ? "pl-10" : "pl-3"} ${rightIcon ? "pr-10" : "pr-3"} focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all duration-200`}
          type={type}
          required
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputBox;