// import { useNavigate } from "react-router-dom";
// export interface CreditType {
//     credits:number
// }
// const CreditButton = ( { credits }:CreditType) => {
//     const navigate = useNavigate();
    
//     const handleClick = () => {
//         navigate("/redeem", {state: {credits:credits}});
//     }
    
//     return (
//         <div className="flex gap-2">
//             <div>
//                 {credits}
//             </div>
//             <button 
//             className="bg-indigo-600 text-white cursor-pointer p-2 rounded-xl"
//             onClick={handleClick}
//             >
//                 Redeem
//             </button>
//         </div>
//     );
// };

// export default CreditButton;





import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Coins, ArrowRight, DollarSign } from 'lucide-react';

export interface CreditType {
  credits: number;
}

const CreditButton = ({ credits }: CreditType) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const handleClick = () => {
    navigate("/redeem", { state: { credits: credits } });
  };
  
  return (
    <div className="flex items-center relative">
      <div 
      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full py-1.5 px-3 flex items-center border border-indigo-100 shadow-sm mr-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <Coins className="w-4 h-4 text-indigo-600 mr-1.5" />
        <span className="font-medium text-indigo-800">{credits}</span>
        {isHovered && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-indigo-100 p-3 w-48 z-50 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Credit Value:</span>
              <div className="flex items-center">
                <DollarSign className="w-3.5 h-3.5 text-green-600 mr-1" />
                <span className="font-medium text-green-600">{credits.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">1 Credit = $1.00</div>
          </div>
        )}
      </div>
      <button 
        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium py-1.5 px-3 rounded-xl flex items-center transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 cursor-pointer"
        onClick={handleClick}
      >
        <span>Redeem</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
      </button>
    </div>
  );
};

export default CreditButton;