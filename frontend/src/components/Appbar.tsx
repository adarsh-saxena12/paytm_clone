import axios from "axios"
import Button from "./Button"
import { useNavigate } from "react-router-dom"
import { Bell, Wallet } from "lucide-react";
import UserProfileMenu from "./UserProfileMenu";
import CreditButton from "./CreditButton";

export const Appbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
         
         try {
         localStorage.removeItem("token");
         navigate("/signin");
         } catch (error) {
            console.log("Error logging out.", error);
            
         }
    }

    return( 
    // <div className="shadow h-14 flex justify-between m-2 gap-60">
    //     <div className="flex flex-col justify-center h-full ml-4 font-bold text-2xl">
    //         PayTM App
    //     </div>
    //     <div className="flex align-bottom gap-4">
    //         <div className="flex">
    //         <div className="flex flex-col justify-center h-full mr-4 font-bold text-2xl">
    //             Hello👋
    //         </div>
    //         <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center mt-1 mr-2">
    //             <div className="flex flex-col justify-center h-full text-xl cursor-pointer">
    //                U
    //             </div>
                
    //         </div>
    //         </div>
    //         <div className="cursor-pointer flex flex-col justify-center h-full mr-4">
    //             <Button onClick={handleClick} label="Logout"/>
    //         </div>
    //     </div>
    // </div>

<nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
                <Wallet className="h-8 w-8 text-violet-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">PayClone</span>
            </div>
            <div>
            <CreditButton 
             credits={1000}  // Replace with actual credits from props or state
            />
            </div>
            <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 text-violet-500 cursor-pointer hover:text-violet-700" />
                <UserProfileMenu onLogout={handleLogout} />
            </div>
        </div>
    </div>
</nav>

    )
}

