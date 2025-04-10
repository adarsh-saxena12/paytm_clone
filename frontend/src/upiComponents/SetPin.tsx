// import React, { useState } from 'react';
// import { Lock, KeyRound, Loader } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PinSetup = () => {
 
//   const [upiPin, setUpiPin] = useState("");
//   const [confirmUpiPin, setConfirmUpiPin] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const navigate = useNavigate();

//   const handlePinSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent page reload

//     setError("");
//     setSuccess("");
    
//     if (upiPin.length !== 6 || confirmUpiPin.length !== 6) {
//       setError("UPI PIN must be exactly 6 digits.");
//       return;
//     }
    
//     if (upiPin !== confirmUpiPin) {
//       setError("UPI PIN and confirmation PIN must match.");
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/upi/setpin",
//         { upiPin, confirmUpiPin },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
      
//       if (response.status === 200 || response.status === 201) {
//         setSuccess(response.data.message || "UPI PIN set successfully.");
//         navigate("/paymentbyupi");
//       } else {
//         setError("Unexpected response. Please try again.");
//       }

//       setUpiPin("");
//       setConfirmUpiPin("");
//     } catch (error: any) {
//       setError(error.response?.data?.error || "Failed to set UPI PIN. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center gap-2 mb-6">
//         <Lock className="w-6 h-6 text-[#00BAF2]" />
//         <h2 className="text-xl font-semibold">Set Up UPI PIN</h2>
//       </div>

//       {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//       {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

//       <form onSubmit={handlePinSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Enter 6-digit UPI PIN
//           </label>
//           <input
//             type="password"
//             maxLength={6}
//             value={upiPin}
//             onChange={(e) => setUpiPin(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
//             placeholder="Enter 6-digit PIN"
//             required
//             pattern="\d{6}"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Confirm UPI PIN
//           </label>
//           <input
//             type="password"
//             maxLength={6}
//             value={confirmUpiPin}
//             onChange={(e) => setConfirmUpiPin(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
//             placeholder="Confirm PIN"
//             required
//             pattern="\d{6}"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#00BAF2] text-white py-3 rounded-lg font-medium hover:bg-[#00a3d6] transition-colors flex items-center justify-center gap-2 cursor-pointer"
//           disabled={loading}
//         >
//           {loading ? <Loader className="animate-spin w-5 h-5" /> : "Set PIN"}
//           <KeyRound className="w-4 h-4" />
//         </button>
//       </form>

//       <div className="mt-6 text-sm text-gray-600">
//         <p>Your UPI PIN will be used to authenticate all UPI transactions.</p>
//       </div>
//     </>
//   );
// };

// export default PinSetup;




import React, { useState } from 'react';
import { Lock, KeyRound, Loader, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PinSetup = () => {
  const [upiPin, setUpiPin] = useState("");
  const [confirmUpiPin, setConfirmUpiPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (upiPin.length !== 6 || confirmUpiPin.length !== 6) {
      setError("UPI PIN must be exactly 6 digits.");
      return;
    }
    
    if (upiPin !== confirmUpiPin) {
      setError("UPI PIN and confirmation PIN must match.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/upi/setpin",
        { upiPin, confirmUpiPin },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      if (response.status === 200 || response.status === 201) {
        setSuccess(response.data.message || "UPI PIN set successfully.");
        navigate("/paymentbyupi");
      } else {
        setError("Unexpected response. Please try again.");
      }

      setUpiPin("");
      setConfirmUpiPin("");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to set UPI PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Set Up UPI PIN</h2>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit UPI PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                placeholder="Enter 6-digit PIN"
                required
                pattern="\d{6}"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm UPI PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={confirmUpiPin}
                onChange={(e) => setConfirmUpiPin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                placeholder="Confirm PIN"
                required
                pattern="\d{6}"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Set PIN
                  <KeyRound className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-600">
                Your UPI PIN will be used to authenticate all UPI transactions. Keep it secure and never share it with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSetup;