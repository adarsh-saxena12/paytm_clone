import React, { useState } from 'react';
import { DollarSign, Wallet } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayByUpiButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const clickHandler = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:3000/api/v1/upi/getupipin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("UPI PIN Response:", res);

      // If UPI PIN is missing, navigate to setpin
      if (!res.data) {
        navigate('/setpin');
      } else {
        navigate('/paymentbyupi');
      }
      
    } catch (error: any) {
      console.error("Error fetching UPI PIN:", error);

      if (error.response?.status === 400) {
        navigate('/setpin');
      } else {
        alert("Error fetching UPI, please try again later.");
        navigate('/dashboard');
      }

    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="text-center py-8">
  //     <button
  //       onClick={clickHandler}
  //       className="bg-[#00BAF2] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#00a3d6] transition-colors flex items-center gap-3 mx-auto cursor-pointer"
  //     >
  //       <DollarSign className="w-5 h-5" />
  //       {loading ? "Loading..." : "Pay via UPI"}
  //     </button>
  //   </div>
  // );
 return(
  <button 
  className="flex items-center bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2 cursor-pointer"
  onClick={clickHandler}
  >
    <Wallet className="h-5 w-5 mr-2" />
    {loading ? "Loading..." : "Pay via UPI"}
  </button>
 )
};

export default PayByUpiButton;
