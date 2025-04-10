// interface buttonType{
//     label:string,
//     onClick?: (e:any) => void
// }
// const Button = ({label, onClick}: buttonType) => {
//     return (
//         <div>
//              <button onClick={onClick} type="button" className=" w-full text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer bg-violet-600">{label}</button>
//         </div>
//     );
// };

// export default Button;






import React from "react";

interface ButtonType {
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = ({ 
  label, 
  onClick, 
  disabled = false, 
  className = "", 
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  fullWidth = true
}: ButtonType) => {
  
  // Base styles
  const baseStyles = "font-medium rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out";
  
  // Size variations
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3"
  };
  
  // Variant styles
  const variantStyles = {
    primary: `text-white focus:ring-violet-300 ${
      disabled || isLoading
        ? "bg-gray-400 cursor-not-allowed opacity-70"
        : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
    }`,
    secondary: `text-indigo-700 focus:ring-indigo-300 ${
      disabled || isLoading
        ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-70"
        : "bg-indigo-100 hover:bg-indigo-200"
    }`,
    outline: `border focus:ring-violet-300 ${
      disabled || isLoading
        ? "border-gray-300 text-gray-400 cursor-not-allowed opacity-70"
        : "border-violet-600 text-violet-600 hover:bg-violet-50"
    }`
  };
  
  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";
  
  return (
    <button 
      onClick={onClick} 
      type={type} 
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className} flex items-center justify-center gap-2 me-2 mb-2 cursor-pointer`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;