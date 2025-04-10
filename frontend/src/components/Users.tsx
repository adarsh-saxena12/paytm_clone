import { useEffect, useState } from "react"
import  Button  from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get("https://paytm-clone-22zb.onrender.com/api/v1/user/bulk?filter=" + filter)
        .then(res => {
            setUsers(res.data.user);
        })
    }, [filter])
    
    return <>
        
        <div className="my-2 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
        </div>
            <input 
            type="text" 
            placeholder="Search users..." 
            onChange={(e) => {
                setFilter(e.target.value)
            }}
            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"></input>
        </div>
        <div className="mt-4">
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

// @ts-ignore
const User = ({user}) => {
 
   const navigate = useNavigate();

   return(
   
   <div className="flex justify-between hover:bg-violet-50">
  
    <div className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer">
      <div className="w-10 h-10 text-violet-600 bg-violet-100 rounded-full flex items-center justify-center">
      
        {user.firstName[0]}
           
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
        <div className="text-xs text-gray-500">@anson</div>
      </div>
    </div>

    <div className="flex justify-center h-full">
            <Button 
            onClick={(e:any) => {
                navigate("/send?id="+user._id+"&name="+user.firstName)
            }}
            label={"Send Money"} />
            
    </div>
  
</div>

)
}




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Search, User, ArrowRight } from "lucide-react";

// interface UserType {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   username?: string;
// }

// export const Users = () => {
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [filter, setFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`)
//       .then(res => {
//         setUsers(res.data.user);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError("Failed to load users");
//         setLoading(false);
//       });
//   }, [filter]);

//   return (
//     <div className="w-full max-w-md mx-auto p-6 space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900">Send Money</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Search and select a recipient to transfer funds
//         </p>
//       </div>

//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <Search className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="Search users..."
//           onChange={(e) => setFilter(e.target.value)}
//           className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
//         />
//       </div>

//       {error && (
//         <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-lg">
//           <span className="text-sm">{error}</span>
//         </div>
//       )}

//       <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-1 rounded-lg">
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             No users found matching your search
//           </div>
//         ) : (
//           users.map((user) => <UserCard key={user._id} user={user} />)
//         )}
//       </div>
//     </div>
//   );
// };

// const UserCard = ({ user }: { user: UserType }) => {
//   const navigate = useNavigate();

//   const handleSendMoney = () => {
//     navigate(`/send?id=${user._id}&name=${user.firstName}`);
//   };

//   return (
//     <div className="flex justify-between items-center p-3 rounded-xl hover:bg-violet-50 transition-colors border border-gray-100 hover:border-violet-200">
//       <div className="flex items-center space-x-3">
//         <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-md">
//           {user.firstName[0]}
//         </div>
//         <div>
//           <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
//           <div className="text-xs text-gray-500">@{user.username || user.firstName.toLowerCase()}</div>
//         </div>
//       </div>

//       <button
//         onClick={handleSendMoney}
//         className="flex items-center justify-center px-4 py-2 rounded-lg text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-sm"
//       >
//         <span>Send</span>
//         <ArrowRight className="ml-1 h-4 w-4" />
//       </button>
//     </div>
//   );
// };

// export default Users;