import './App.css';
import Menu from './Components/Menu';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Cart from './Components/Cart';
import { setMenuList } from './redux/actions/index'; // Import action
import { Route, Routes } from 'react-router-dom';
import AboutUs from './Components/About';
import Reservation from './Components/Reservation';
import ContactUs from './Components/ContactUs';
import OrderOnline from './Components/OrderOnline';
import OrderDetails from './Components/OrderDetails';
import Login from './pages/Login/login'
import SignUp from './pages/SignUp/SignUp'
import VerifyGmail from './pages/verifyOtp/GmailAuth'
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';
import VerifyOTP from './pages/verifyOtp/verifyGmailOtp';
import MyProfile from './Components/Profile';
import { useAuthContext } from './context/AuthContext';
import AdminPage from './Components/AdminPage';
import CanteenPage from './Components/Canteens';
function App() {
 
      const {authUser} = useAuthContext();

  
  return (
    <div className="App">
      
      <Routes>
        <Route path='/' element={<AdminPage />} />
        




      </Routes>


    </div>
  );
}

export default App;
