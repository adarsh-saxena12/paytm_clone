import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpCircle, ArrowDownCircle, History as HistoryIcon, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import moment from "moment";

interface Transaction {
  _id: string;
  senderId: { username: string; firstName: string; lastName: string };
  receiverId: { username: string; firstName: string; lastName: string };
  amount: number;
  timestamp: string;
}
interface UserType {
  username: string,
  firstName: string,
  lastName: string
}

const History = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>();
 
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          "https://paytm-clone-22zb.onrender.com/api/v1/account/history",
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
        );
        setTransactions(data.transactions);
        console.log("currentUser", data.currentUser);
        console.log("transactions: ", data.transactions);
        
        
        setCurrentUser(data.currentUser)
        console.log("Data: ", data);
        
        
        
      } catch (error) {
        console.error("Error fetching history", error);
      }
    };

    fetchHistory();
  }, [])

return (
  // max-w-3xl
  <div className="min-h-screen bg-gray-50">
    <div className="mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className=" px-6 py-4">
          <div className="flex items-center space-x-3">
            <HistoryIcon className="h-6 w-6 text-purple-600"/>
          
            <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Transaction History</h1>
          </div>
        </div>

        {/* Transaction List */}
        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => {
                const isSent = tx.senderId.username === currentUser?.username;
                const otherParty = isSent ? tx.receiverId : tx.senderId;
                
                return (
                  <div
                    key={tx._id}
                    className="group relative bg-white rounded-xl border hover:bg-violet-50 border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          isSent ? "bg-red-100" : "bg-green-100"
                        }`}>
                          {isSent ? (
                            <ArrowUp className="h-6 w-6 text-red-600" />
                          ) : (
                            <ArrowDown className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {isSent ? "Sent to" : "Received from"}
                          </p>
                          <p className="font-medium text-gray-900">
                            {otherParty.firstName} {otherParty.lastName}
                          </p>
                          <p className="text-sm text-gray-400">@{otherParty.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          isSent ? "text-red-600" : "text-green-600"
                        }`}>
                          {isSent ? "-" : "+"}${tx.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {moment(tx.timestamp).format("MMM D, YYYY")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {moment(tx.timestamp).format("h:mm A")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default History;


// const History = () => <div className="space-y-4">
//   {/* Placeholder transaction history */}
//   {[1, 2, 3].map((i) => (
//     <div key={i} className="flex items-center justify-between p-3 hover:bg-violet-50 rounded-lg">
//       <div className="flex items-center space-x-3">
//         <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
//           <ArrowDownUp className="h-5 w-5 text-violet-600" />
//         </div>
//         <div>
//           <div className="text-sm font-medium text-gray-900">Transaction {i}</div>
//           <div className="text-xs text-gray-500">March {i}, 2024</div>
//         </div>
//       </div>
//       <div className="text-sm font-medium text-gray-900">₹{(i * 1000).toLocaleString()}</div>
//     </div>
//   ))}
// </div>;
