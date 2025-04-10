// import React, { useState } from 'react';
// import { QrCode, Smartphone, ArrowRight, DollarSign } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { z } from 'zod';

// const paymentSchema = z.object({
//   amount: z.number().positive("Enter a valid amount."),
//   upiId: z.string().min(3, "Invalid recipient ID."),
//   upiPin: z.string().length(6, "Invalid UPI pin, It must be 6 digit.")
// });

// const PaymentForm = () => {
//   const [amount, setAmount] = useState<Number>();
//   const [upiId, setUpiId] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [upiPin, setUpiPin] = useState("");
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

//   const handleTransfer = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(false);

//     const validationResult = paymentSchema.safeParse({ amount, upiId, upiPin });
//     if (!validationResult.success) {
//       setError(validationResult.error.errors[0].message);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Unauthorized: No token found.");
//         return;
//       }

//       const response = await axios.post("http://localhost:3000/api/v1/upi/paymentbyupi", 
//         { to: upiId, amount, upiPin }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
     
//       if (response.status === 200) {
//         setSuccess(true);
//         setTimeout(() => navigate("/successpage", { state: { amount, upiId } }), 2000);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Transaction failed.");
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center gap-2 mb-6">
//         <DollarSign className="w-6 h-6 text-[#00BAF2]" />
//         <h2 className="text-xl font-semibold">Pay via UPI</h2>
//       </div>

//       <form onSubmit={handleTransfer} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//             <input
//               type="number"
//               value={Number(amount)}
//               onChange={(e) => setAmount(Number(e.target.value))}
//               className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
//               placeholder="Enter amount"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
//           <input
//             type="text"
//             value={upiId}
//             onChange={(e) => setUpiId(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
//             placeholder="Enter UPI ID (e.g. name@upi)"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">UPI PIN</label>
//           <input
//             type="password"
//             value={upiPin}
//             onChange={(e) => setUpiPin(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
//             placeholder="Enter your 6 digit UPI pin."
//             required
//           />
//         </div>

//         <div className="flex gap-4">
//           <button
//             type="submit"
//             className="cursor-pointer flex-1 bg-[#00BAF2] text-white py-3 rounded-lg font-medium hover:bg-[#00a3d6] transition-colors flex items-center justify-center gap-2"
//           >
//             Pay Now
//             <ArrowRight className="w-4 h-4" />
//           </button>
//           <button
//             type="button"
//             className="flex-1 border border-[#00BAF2] text-[#00BAF2] py-3 rounded-lg font-medium hover:bg-[#00BAF2] hover:text-white transition-colors flex items-center justify-center gap-2"
//           >
//             <QrCode className="w-4 h-4" />
//             Pay via QR
//           </button>
//         </div>
//       </form>

//       <div className="mt-8 border-t pt-6">
//         <div className="flex items-center gap-3 text-gray-600">
//           <Smartphone className="w-5 h-5" />
//           <p className="text-sm">You can also pay using any UPI app on your phone</p>
//         </div>
//       </div>

//       {error && <p className="text-red-500 mt-4">{error}</p>}
//       {success && <p className="text-green-500 mt-4">Payment successful!</p>}
//     </>
//   );
// };

// export default PaymentForm;














// import React, { useState } from 'react';
// import { QrCode, Smartphone, ArrowRight, DollarSign } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { z } from 'zod';

// const paymentSchema = z.object({
//   amount: z.number().positive("Enter a valid amount."),
//   upiId: z.string().min(3, "Invalid recipient ID."),
//   upiPin: z.string().length(6, "Invalid UPI pin, It must be 6 digit.")
// });

// const PaymentForm = () => {
//   const [amount, setAmount] = useState<Number>();
//   const [upiId, setUpiId] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [upiPin, setUpiPin] = useState("");
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

//   const handleTransfer = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(false);

//     const validationResult = paymentSchema.safeParse({ amount, upiId, upiPin });
//     if (!validationResult.success) {
//       setError(validationResult.error.errors[0].message);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Unauthorized: No token found.");
//         return;
//       }

//       const response = await axios.post("http://localhost:3000/api/v1/upi/paymentbyupi", 
//         { to: upiId, amount, upiPin }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
     
//       if (response.status === 200) {
//         setSuccess(true);
//         setTimeout(() => navigate("/successpage", { state: { amount, upiId } }), 2000);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Transaction failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center p-6">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6">
//           <div className="flex items-center gap-3">
//             <div className="bg-white/20 p-2 rounded-lg">
//               <DollarSign className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-white">Pay via UPI</h2>
//           </div>
//         </div>

//         <div className="p-8">
//           <form onSubmit={handleTransfer} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   value={Number(amount)}
//                   onChange={(e) => setAmount(Number(e.target.value))}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50 transition-all duration-200"
//                   placeholder="Enter amount"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
//               <input
//                 type="text"
//                 value={upiId}
//                 onChange={(e) => setUpiId(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50 transition-all duration-200"
//                 placeholder="Enter UPI ID (e.g. name@upi)"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">UPI PIN</label>
//               <input
//                 type="password"
//                 value={upiPin}
//                 onChange={(e) => setUpiPin(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
//                 placeholder="Enter your 6 digit UPI pin"
//                 required
//               />
//             </div>

//             <div className="flex gap-4 pt-2">
//               <button
//                 type="submit"
//                 className="flex-1 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
//               >
//                 Pay Now
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//               <button
//                 type="button"
//                 className="flex-1 cursor-pointer border-2 border-violet-600 text-violet-600 py-3 px-6 rounded-xl font-medium hover:bg-violet-50 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
//               >
//                 <QrCode className="w-4 h-4" />
//                 Pay via QR
//               </button>
//             </div>
//           </form>

//           <div className="mt-8 border-t border-gray-100 pt-6">
//             <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
//               <div className="bg-indigo-100 p-2 rounded-lg">
//                 <Smartphone className="w-5 h-5 text-indigo-600" />
//               </div>
//               <p className="text-sm text-gray-600">
//                 You can also pay using any UPI app on your phone
//               </p>
//             </div>
//           </div>

//           {error && (
//             <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="mt-4 bg-green-50 text-green-600 p-4 rounded-xl text-sm">
//               Payment successful!
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;






import React, { useState } from 'react';
import { QrCode, Smartphone, ArrowRight, DollarSign, CreditCard, Lock, Loader } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().positive("Enter a valid amount."),
  upiId: z.string().min(3, "Invalid recipient ID."),
  upiPin: z.string().length(6, "Invalid UPI pin. It must be 6 digits.")
});

const PaymentForm = () => {
  const [amount, setAmount] = useState<number>();
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [upiPin, setUpiPin] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    const validationResult = paymentSchema.safeParse({ amount, upiId, upiPin });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      const response = await axios.post("https://paytm-clone-22zb.onrender.com/api/v1/upi/paymentbyupi", 
        { to: upiId, amount, upiPin }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/successpage", { state: { amount, upiId } }), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-0 space-y-0 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(103,58,183,0.3)] overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Make Payment</h2>
          </div>
          <p className="mt-2 text-white/80 text-sm">
            Fast, secure payments via UPI
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-lg">
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="flex items-center text-green-500 bg-green-50 p-3 rounded-lg">
              <span className="text-sm">Payment successful! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-5">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="amount"
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  placeholder="Enter amount"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  placeholder="name@upi"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="upiPin" className="block text-sm font-medium text-gray-700 mb-1">
                UPI PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="upiPin"
                  type="password"
                  value={upiPin}
                  onChange={(e) => setUpiPin(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Your UPI PIN is encrypted and secure</p>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader className="animate-spin w-5 h-5" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    Pay Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
              
              <button
                type="button"
                className="w-full flex justify-center items-center py-3.5 px-4 border-2 border-indigo-600 rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Smartphone className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Multiple payment options</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  You can also pay using any UPI app on your phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;