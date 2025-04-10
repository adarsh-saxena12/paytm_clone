// import { LogOut, User } from "lucide-react";
// import { useState } from "react";

// const UserProfileMenu = ({ onLogout }: { onLogout: () => void }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showProfileModal, setShowProfileModal] = useState(false);
  
//     const toggleMenu = () => setIsOpen(!isOpen);
  
//     return (
//       <div className="relative">
//         <button
//           onClick={toggleMenu}
//           className="flex items-center space-x-2 p-2 rounded-full hover:bg-violet-100 transition"
//         >
//           <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
//             <User className="h-5 w-5 text-violet-600" />
//           </div>
//         </button>
  
//         {isOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
//             <button
//               onClick={() => {
//                 setShowProfileModal(true);
//                 setIsOpen(false);
//               }}
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-violet-50"
//             >
//               <User className="h-4 w-4 mr-2" />
//               Profile
//             </button>
//             <button
//               onClick={onLogout}
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-violet-50"
//             >
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </button>
//           </div>
//         )}
  
//         {showProfileModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-violet-900">Profile Settings</h2>
//                 <button
//                   onClick={() => setShowProfileModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ×
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex justify-center">
//                   <div className="w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
//                     <User className="h-12 w-12 text-white" />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-violet-200 rounded-md focus:ring-violet-500 focus:border-violet-500"
//                     placeholder="John Doe"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     className="w-full px-3 py-2 border border-violet-200 rounded-md focus:ring-violet-500 focus:border-violet-500"
//                     placeholder="john@example.com"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     className="w-full px-3 py-2 border border-violet-200 rounded-md focus:ring-violet-500 focus:border-violet-500"
//                     placeholder="+91 9876543210"
//                   />
//                 </div>
                
//                 <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-violet-700 hover:to-purple-700 transition">
//                   Update Profile
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   export default UserProfileMenu





import React, { useEffect, useState } from 'react';
import { LogOut, User, X, Camera, Mail, Lock, Loader, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfileMenu = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = async () => {
    if (!userData.firstName || !userData.lastName) {
      setError('First name and last name are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      const res = await axios.put(
        "https://paytm-clone-22zb.onrender.com/api/v1/user/update", 
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.status === 200) {
        setShowProfileModal(false);
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Update failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all duration-200 transform hover:scale-[1.02]"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center cursor-pointer shadow-md">
          <User className="h-5 w-5 text-white" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-10 border border-gray-100 transform transition-all duration-200 ease-out">
          <button
            onClick={() => {
              setShowProfileModal(true);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-colors"
          >
            <User className="h-4 w-4 mr-3 text-violet-600" />
            View Profile
          </button>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3 text-violet-600" />
            Sign Out
          </button>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 ease-out">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative flex justify-center -mt-12 mb-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25 ring-4 ring-white">
                  <User className="h-12 w-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-1/3 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-violet-600" />
                </button>
              </div>
              
              {error && (
                <div className="mb-4 flex items-center text-red-500 bg-red-50 p-3 rounded-lg">
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                      placeholder="John"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                      placeholder="Doe"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                      placeholder="••••••"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
                    onClick={handleClick}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;