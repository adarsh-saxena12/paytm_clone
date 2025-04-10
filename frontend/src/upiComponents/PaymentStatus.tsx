// import React from 'react';
// import { CheckCircle2 } from 'lucide-react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const PaymentStatus = () => {
  
//   const location = useLocation();
//   const { amount, upiId } = location.state || {};
//   const navigate = useNavigate();

//   return (
//     <div className="text-center py-8">
//       <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
//       <h2 className="text-2xl font-semibold mt-4">Payment Successful!</h2>
//       <p className="text-gray-600 mt-2">${amount} has been sent successfully to {upiId}</p>
//       <button
//         onClick={() => navigate("/paymentbyupi")}
//         className="mt-6 px-6 py-2 bg-[#00BAF2] text-white rounded-lg hover:bg-[#00a3d6] transition-colors"
//       >
//         Make Another Payment
//       </button>

//       <button
//         onClick={() => navigate("/dashboard")}
//         className="mt-6 px-6 py-2 bg-[#00BAF2] text-white rounded-lg hover:bg-[#00a3d6] transition-colors"
//       >
//         Home
//       </button>
      
//     </div>
//   );
// };

// export default PaymentStatus;



import React, { useEffect, useState } from 'react';
import { CheckCircle2, Home, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const { amount, upiId } = location.state || { amount: '1,000', upiId: 'example@upi' };
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex flex-col">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Success animation wrapper */}
          <div 
            className={`relative flex justify-center transition-all duration-700 ease-out ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="absolute -top-2 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl" />
            <CheckCircle2 
              className="w-24 h-24 text-emerald-500 relative animate-[bounce_2s_ease-in-out_infinite]" 
              strokeWidth={1.5}
            />
          </div>

          <div 
            className={`w-full transition-all duration-700 delay-200 ease-out ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-center mt-8 tracking-tight">
              Payment Successful
            </h2>
            
            <div className="mt-12 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-violet-100">
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-violet-600">Amount Paid</p>
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">${amount}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-violet-100 text-center">
                  <p className="text-sm text-violet-600">Paid to</p>
                  <p className="text-base font-medium text-gray-700 mt-1">{upiId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/paymentbyupi")}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Make Another Payment
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-medium hover:bg-white transition-all duration-300 border border-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </button>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="mt-12 text-center space-y-2">
              <p className="text-sm text-violet-500">
                Transaction ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}
              </p>
              <p className="text-xs text-violet-400">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;