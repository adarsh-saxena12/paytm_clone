import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import History from "./History";
import PayViaUpiButton from "../upiComponents/PayByUpiButton";
import { ArrowDownUp, Bell, UsersIcon, Wallet } from "lucide-react";
import UserProfileMenu from "../components/UserProfileMenu";
import CreditButton from "../components/CreditButton";

// export const Dashboard = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");
//     const [balance, setBalance] = useState(0);

//     useEffect(() => {
//        const fetchBalance = async () => {
//          const res = await axios.get(
//             "http://localhost:3000/api/v1/account/balance",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//          );
//          console.log("balance: ", res.data.balance);
         
//          setBalance(res.data.balance)
//        }

//        fetchBalance();
//     }, [token]);

//     useEffect(() => {
//         if (!token) {
//             navigate("/signin");
//         }
//     }, [token, navigate]);  // Dependencies ensure redirection happens correctly

//     if (!token) return null; // Prevents rendering while navigating

//     return (
//         <div className="flex justify-between">
//             <div className="border-1 border-indigo-500 m-10 h-[80vh] rounded-3xl p-10">
//             <Appbar />
            
//             <div className="m-8">
//                 <Balance value={balance} />
//                 <Users />
//             </div>
            
            
//             </div>
//             <div>
//                 <PayViaUpiButton />
//             </div>
//             <div>
//              <History />
//             </div>
//         </div>
//     );
// };


export const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [balance, setBalance] = useState(0);
    const [credits, setCredits] = useState(0);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/v1/account/balance",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setBalance(res.data.balance);
                setCredits(res.data.credits);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
                setBalance(0);
            }
        };

        if (token) {
            fetchBalance();
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate("/signin");
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    if (!token) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        
                        <div className="flex items-center">
                            <Wallet className="h-8 w-8 text-violet-600" />
                            <span className="ml-2 text-xl font-semibold text-gray-900">Zepay</span>
                        </div>
                        <div className="flex gap-6 items-center">
                        <div>
                            <CreditButton credits={credits} />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Bell className="h-6 w-6 text-violet-500 cursor-pointer hover:text-violet-700" />
                            <UserProfileMenu onLogout={handleLogout} />
                        </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                            <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
                            <div className="mt-2 text-3xl font-bold">${balance.toLocaleString()}</div>
                            <div className="mt-4 flex space-x-4">
                                <button className="flex items-center bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2">
                                    <ArrowDownUp className="h-5 w-5 mr-2" />
                                    Send Money
                                </button>
                                <PayViaUpiButton />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {['Mobile Recharge', 'Electricity', 'DTH', 'Credit Card'].map((action) => (
                                    <button
                                        key={action}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-200 rounded-full flex items-center justify-center mb-2">
                                            <Wallet className="h-6 w-6 text-violet-600" />
                                        </div>
                                        <span className="text-sm text-gray-700">{action}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        {/* <div className="bg-white rounded-2xl p-6 shadow-sm"> */}
                            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2> */}
                            <History />
                        {/* </div> */}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Contacts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
                                <UsersIcon className="h-5 w-5 text-violet-500" />
                            </div>
                            <Users />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};