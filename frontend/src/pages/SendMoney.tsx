// import axios from "axios";
// import { useState } from "react";
// import { useSearchParams } from "react-router-dom"

// export const SendMoney = () => {

//     const [searchParams] = useSearchParams();
//     const id = searchParams.get("id");
//     const name = searchParams.get("name");
//     const [amount, setAmount] = useState<number>(0);
    
//     return <div className="flex justify-center h-screen bg-gray-100">
//         <div className="h-full flex flex-col justify-center">
//             <div
//                 className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
//             >
//                 <div className="flex flex-col space-y-1.5 p-6">
//                 <h2 className="text-3xl font-bold text-center">Send Money</h2>
//                 </div>
//                 <div className="p-6">
//                 <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
//                     <span className="text-2xl text-white">A</span>
//                     </div>
//                     <h3 className="text-2xl font-semibold">Friend's Name</h3>
//                 </div>
//                 <div className="space-y-4">
//                     <div className="space-y-2">
                    
//                     <label
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                         htmlFor="amount"
//                     >
//                         Amount (in Rs)
//                     </label>

//                     <input
//                         type="number"
//                         onChange={(e:any) => {
//                             setAmount(e.target.value)
//                         }}
//                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                         id="amount"
//                         placeholder="Enter amount"
//                     />
//                     </div>
//                     <button
//                     onClick={() => {
//                         axios.post("http://localhost:3000/api/v1/account/transfer", {
//                             to:id,
//                             amount
//                         }, {
//                             headers: {
//                                 Authorization: "Bearer " + localStorage.getItem("token")
//                             }
//                         })

//                         // show the transfer completion
//                     }} 
//                     className="cursor-pointer justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
//                         Initiate Transfer
//                     </button>
//                 </div>
//                 </div>
//         </div>
//       </div>
//     </div>
// }




// import axios from "axios";
// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// export const SendMoney = () => {
//     const [searchParams] = useSearchParams();
//     const id = searchParams.get("id");
//     const name = searchParams.get("name");
//     const [amount, setAmount] = useState<number>(0);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<boolean>(false);
//     const navigate = useNavigate();

//     const handleTransfer = async () => {

//         if (!id) {
//             setError("Invalid recipient ID.");
//             return;
//         }

//         if (amount <= 0) {
//             setError("Enter a valid amount.");
//             return;
//         }

//         try {
//             setError(null);
//             setSuccess(false);

//             const token = localStorage.getItem("token");
//             if (!token) {
//                 setError("Unauthorized: No token found.");
//                 return;
//             }

//             const response = await axios.post("http://localhost:3000/api/v1/account/transfer", 
//                 {
//                     to: id,
//                     amount: Number(amount) // Ensure it's a number
//                 }, 
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}` // Use proper string interpolation
//                     }
//                 }
//             );

//             if (response.status === 200) {
//                 setSuccess(true);
//                 setTimeout(() => navigate("/dashboard"), 3000)
//             }
            
//         } catch (err: any) {
//             setError(err.response?.data?.message || "Transaction failed.");
//         }

//     };

//     return (

//         <div className="flex justify-center h-screen bg-gray-100">
//             <div className="h-full flex flex-col justify-center">
//                 <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
//                     <div className="flex flex-col space-y-1.5 p-6">
//                         <h2 className="text-3xl font-bold text-center">Send Money</h2>
//                     </div>
//                     <div className="p-6">
//                         <div className="flex items-center space-x-4">
//                             <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
//                                 <span className="text-2xl text-white">{name?.charAt(0) || "A"}</span>
//                             </div>
//                             <h3 className="text-2xl font-semibold">{name || "Unknown"}</h3>
//                         </div>
//                         <div className="space-y-4">
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium leading-none" htmlFor="amount">
//                                     Amount (in Rs)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     value={amount}
//                                     onChange={(e) => setAmount(Number(e.target.value))} // Convert to number
//                                     className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm"
//                                     id="amount"
//                                     placeholder="Enter amount"
//                                 />
//                             </div>

//                             <button
//                                 onClick={handleTransfer}
//                                 className="cursor-pointer justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-green-500 text-white"
//                             >
//                                 Initiate Transfer
//                             </button>

//                             {error && <p className="text-red-500 text-sm">{error}</p>}
//                             {success && <p className="text-green-500 text-sm">Transfer successful!</p>}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
// );
// };



import React, { useState } from 'react';
import { SendHorizontal, Loader, BanknoteIcon, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleTransfer = async () => {
    if (!id) {
      setError("Invalid recipient ID.");
      return;
    }

    if (amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        return;
      }

      const response = await axios.post(
        "https://paytm-clone-22zb.onrender.com/api/v1/account/transfer",
        {
          to: id,
          amount: Number(amount)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white">Send Money</h2>
            <div className="w-5" /> {/* Spacer for alignment */}
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-xl">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <span className="text-2xl font-bold text-white">
                {name?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{name || "Unknown"}</h3>
              <p className="text-sm text-gray-600">Recipient</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl text-sm">
              Transfer successful! Redirecting...
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (in Rs)
              </label>
              <div className="relative">
                <BanknoteIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <button
              onClick={handleTransfer}
              disabled={loading}
              className="w-full cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Send Money
                  <SendHorizontal className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <SendHorizontal className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-600">
                Money will be instantly transferred to the recipient's account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;