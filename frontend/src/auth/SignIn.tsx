// import { useState } from "react"
// import  BottomWarning  from "../components/BottomWarning"
// import  Button  from "../components/Button"
// import  Heading  from "../components/Heading"
// import  InputBox  from "../components/InputBox"
// import  SubHeading  from "../components/SubHeading"
// import axios from "axios"
// import { useNavigate } from "react-router-dom"

// export const SignIn = () => {
    
//     const navigate = useNavigate();
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");

//     return <div className="bg-slate-300 h-screen flex justify-center">
//     <div className="flex flex-col justify-center">
//       <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
//         <Heading label={"Sign in"} />
//         <SubHeading label={"Enter your credentials to access your account"} />
//         <InputBox 
//         placeholder="example@gmail.com" 
//         label={"Email"} 
//         onChange={(e) => {
//           setUsername(e.target.value)
//         }}
//         />
//         <InputBox 
//         placeholder="123456" 
//         label={"Password"} 
//         onChange={(e) => {
//           setPassword(e.target.value)
//         }}
//         />
//         <div className="pt-4">
//           <Button 
//           label={"Sign in"} 
//           onClick={async () => {
//             const res = await axios.post("http://localhost:3000/api/v1/user/signin", {
//               username,
//               password
//             },);
//             console.log("signin_page: ", res.data);
            
//             // localStorage.setItem("token", res.data.token)
//             if(res.status === 200){
//               navigate("/verifyotp", {state: {token: res.data.sessionId}});
//             }
//           }}
//           />
//         </div>
//         <BottomWarning 
//         label={"Don't have an account?"} buttonText={"Sign up"} 
//         to={"/signup"} />
//       </div>
//     </div>
//   </div>
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, CreditCard } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://paytm-clone-22zb.onrender.com/api/v1/user/signin", {
        username,
        password
      });
      alert(res.data.message);
      if (res.status === 200) {
        navigate("/verifyotp", { state: { sessionId: res.data.sessionId, verificationType:"verify-signin" } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(103,58,183,0.3)]">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-sm text-gray-500 max-w-xs mx-auto">
            Sign in to your account to access your payment dashboard
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-lg">
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                placeholder="••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="cursor-pointer w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div className="pt-4 mt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our <a href="#" className="text-indigo-500 hover:text-indigo-700">Terms of Service</a> and <a href="#" className="text-indigo-500 hover:text-indigo-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};


export default SignIn;


