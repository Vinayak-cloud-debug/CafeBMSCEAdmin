


import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

// Create context
export const AuthContext = createContext();

// Hook to use the AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};



export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData,setUserData] = useState({
    fullName:"",
    EmailId:"",
    Password:"" 

})


  const location = useLocation(); // Detect route changes

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Assuming the backend has a route to validate token from cookie
        const res = await axios.get("http://localhost:9001/api/getToken", {
          withCredentials: true, // Send cookies with request
        });

        console.log("Token validation response:", res.data.token);
        console.log("User Data:", res.data.user,res.data.user.username);


        console.log(res.data.user.fullName,res.data.user.username,res.data.user.gender)

        localStorage.setItem("FullName",res.data.user.fullName);
        localStorage.setItem("EmailId",res.data.user.username);
        localStorage.setItem("Gender",res.data.user.gender);


        console.log(res.data.token)
        if (res.data.token) {
          console.log("Authenticated")
          
          setAuthUser(res.data.token); // If authenticated, set the user
          setUserData(res.data.user)
          
        } else {
          console.log("Not Authenticated")
          setAuthUser(null); // If not authenticated, clear user
        }
      } catch (error) {
        console.error("Token validation failed", error);
        setAuthUser(null); // If there's an error, clear the user
      } 
    };

    validateToken(); // Validate the token when the component mounts
  }, [location.pathname]); // Empty dependency array ensures this effect runs only once on mount


  return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};

