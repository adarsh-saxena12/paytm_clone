// import axios from "axios";
// import { useState } from "react";
// import { CreditType } from "./CreditButton";

// const RedeemPage = ({ credits }: CreditType) => {
   
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);
//     const handleRedeem = async () => {
//         try {
//             const res = await axios.post("http://localhost:3000/api/v1/cerdits/redeem",
//             {
//                 credits:credits
//             },
//                 {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`
//                 }
//             })

//             if(res.status === 200){
//                 setSuccess(true);
//             }

//         } catch (error:any) {
//             setError(error)
//             console.log("Error: ", error);
//         }
//     }
//     return (
//         <div>
//             <button
//             className=""
//             onClick={handleRedeem}
//             >Redeem</button>
//         </div>
//     );
// };

// export default RedeemPage;




import axios from "axios";
import { useState, useEffect } from "react";
import { CreditType } from "./CreditButton";
import { CheckCircle, AlertCircle, Coins, Sparkles, Gift, Shield, ArrowRight, Clock, CreditCard, DollarSign, Info } from "lucide-react";
import Toast from "./Toast";
import { useLocation } from "react-router-dom";

const RedeemPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();
  const credits = location.state.credits;

  useEffect(() => {
    if (success) {
      setShowToast(true);
    }
  }, [success]);

  const handleRedeem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(
        "https://paytm-clone-22zb.onrender.com/api/v1/credits/redeem",
        {
          credits: credits
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.status === 200) {
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to redeem credits. Please try again.");
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-md w-full relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-200 rounded-full opacity-20 blur-xl"></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="text-center mt-14 mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 mb-2">Redeem Credits</h2>
            <p className="text-gray-600">
              You are about to redeem <span className="font-bold text-indigo-700">{credits}</span> credits from your account
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="text-gray-700">Available Credits</span>
              </div>
              <span className="text-xl font-bold text-indigo-800">{credits}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-gray-700">Cash Value</span>
              </div>
              <span className="text-xl font-bold text-green-600">${credits.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mb-6 flex items-start border border-amber-200">
            <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
              <span className="font-medium">1 Credit = $1.00</span> - You will receive ${credits.toFixed(2)} after redemption is complete.
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">Credits successfully redeemed!</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl p-4 mb-6 flex items-center border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : null}

          <button
            className={`cursor-pointer w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
              success
                ? "bg-green-500 text-white cursor-not-allowed"
                : loading
                ? "bg-indigo-400 text-white cursor-wait"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30"
            }`}
            onClick={handleRedeem}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Redeemed Successfully
              </>
            ) : (
              <>
                <Gift className="w-5 h-5 mr-2" />
                Redeem Credits
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>

          {!success && (
            <div className="mt-6 space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-indigo-50">
                <CreditCard className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-indigo-800">Instant Processing</h4>
                  <p className="text-xs text-gray-600">Credits will be processed immediately to your account</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 rounded-lg bg-purple-50">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-purple-800">Secure Transaction</h4>
                  <p className="text-xs text-gray-600">All redemptions are secured with end-to-end encryption</p>
                </div>
              </div>
            </div>
          )}

          {!success && (
            <p className="text-xs text-center mt-6 text-gray-500">
              By redeeming credits, you agree to our terms and conditions regarding credit redemption.
            </p>
          )}
        </div>
      </div>

      {/* Toast notification */}
      <Toast 
        message="Credits successfully redeemed! Your account has been updated." 
        visible={showToast} 
        onClose={() => setShowToast(false)}
        type="success"
        duration={5000}
      />
    </div>
  );
};

export default RedeemPage;