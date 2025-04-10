
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // For demo purposes, create a mock sessionId if not provided by location state
  const sessionId = location.state?.sessionId || 'mock-session-id';
  const verificationType = location.state?.verificationType;
  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
 
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Move to next input if current one is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
        // @ts-ignore
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // @ts-ignore
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };
  
  const handleSubmit = async () => {
    const otpString = otp.join('');
    
    // Validate OTP
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`http://localhost:3000/api/v1/user/${verificationType}`, {
        otp: otpString,
        sessionId: sessionId
      }, { withCredentials: true});
      
      if (res.status === 200) {
        setSuccess(true);
        localStorage.setItem("token", res.data.token);
        
        // Navigate after a short delay to show success state
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(103,58,183,0.3)]">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">Secure Verification</h2>
          <p className="mt-3 text-sm text-gray-500 max-w-xs mx-auto">
            We've sent a 6-digit verification code to your device for authentication
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-xl font-semibold text-gray-900 mt-2">Verification Successful!</p>
            <p className="text-sm text-gray-500 mt-1">Redirecting you to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="mt-10">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-4">
                Enter your verification code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  />
                ))}
              </div>
              
              {error && (
                <div className="mt-4 flex items-center text-red-500 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="cursor-pointer w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : 'Verify & Continue'}
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer">
                  Resend Code
                </button>
              </p>
            </div>
            
            <div className="pt-4 mt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                By continuing, you agree to our <a href="#" className="text-indigo-500 hover:text-indigo-700">Terms of Service</a> and <a href="#" className="text-indigo-500 hover:text-indigo-700">Privacy Policy</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;