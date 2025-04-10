import { BrowserRouter, Routes, Route } from "react-router-dom";
import  SignUp from "./auth/SignUp";
import SignIn from "./auth/SignIn";
import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from "./pages/SendMoney"
import PinSetup from "./upiComponents/SetPin";
import PaymentForm from "./upiComponents/PaymentForm";
import PayByUpiButton from "./upiComponents/PayByUpiButton";
import PaymentStatus from "./upiComponents/PaymentStatus";
import RedeemPage from "./components/RedeemPage";
import VerifyOtp from "./pages/VerifyOtp";



function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/setpin" element={<PinSetup />} />
        <Route path="/paymentbyupi" element={<PaymentForm />} />
        <Route path="/successpage" element={<PaymentStatus />} />
        <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
