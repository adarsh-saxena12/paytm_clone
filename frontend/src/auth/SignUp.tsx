// import { useState } from "react"
// import BottomWarning from "../components/BottomWarning"
// import  Button from "../components/Button"
// import  Heading  from "../components/Heading"
// import  InputBox  from "../components/InputBox"
// import  SubHeading  from "../components/SubHeading"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"

// export const SignUp = () => {

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();


//     return <div className="bg-slate-300 h-screen flex justify-center">
//     <div className="flex flex-col justify-center">
//       <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
//         <Heading label={"Sign up"} />
//         <SubHeading label={"Enter your infromation to create an account"} />

//         <InputBox 
//         placeholder="John" 
//         label={"First Name"} 
//         onChange={(e:any) => {
//           setFirstName(e.target.value)
//         }}
//         />

//         <InputBox 
//         placeholder="Doe" 
//         label={"Last Name"} 
//         onChange={(e:any) => {
//           setLastName(e.target.value)
//         }}
//         />

//         <InputBox 
//         placeholder="harkirat@gmail.com" 
//         label={"Email"} 
//         onChange={(e:any) => {
//           setUsername(e.target.value)
//         }}
//         />

//         <InputBox 
//         placeholder="123456" 
//         label={"Password"} 
//         onChange={(e:any) => {
//           setPassword(e.target.value)
//         }}
//         />
        
//         <div 
//         className="pt-4">
//           <Button 
//           onClick={async () => {
//             const res = await axios.post("http://localhost:3000/api/v1/user/signup", {
//               username,
//               firstName,
//               lastName,
//               password
//             })
//             localStorage.setItem("token", res.data.token)
//             navigate("/dashboard")
//           }}
//           label={"Sign up"}
          
//           />
//         </div>

//         <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />

//       </div>
//     </div>
//   </div>
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, CreditCard, User } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!firstName || !lastName || !username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signup", {
        username,
        firstName,
        lastName,
        password
      });
      
      if (res.status === 200) {
        navigate("/verifyotp", { state: { sessionId: res.data.sessionId, verificationType:"verify-signup" } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign up failed. Please try again.");
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
          <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-3 text-sm text-gray-500 max-w-xs mx-auto">
            Enter your information to create a payment account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-lg">
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  placeholder="John"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                placeholder="••••••"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="cursor-pointer w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
        
        <div className="pt-4 mt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            By signing up, you agree to our <a href="#" className="text-indigo-500 hover:text-indigo-700">Terms of Service</a> and <a href="#" className="text-indigo-500 hover:text-indigo-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;