import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client"
import {CgSpinner} from "react-icons/cg"


const socket = io.connect(process.env.REACT_APP_API_URL)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUser, setOpenUser] = useState({status:false,userData:null});

  const  [activeUser, setAtiveUser] = useState([]);

  const fetchUserDetails = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/login/fetchdata`,
        {
          headers: { token: token },
        }
      );
      
      setUserDetails(res.data);
      setAuth(true);
      setLoading(false)
      return res;
    } catch (error) {
      setLoading(false)
      throw error;
    }
  };

  const logOut=()=>{
    setUserDetails(null)
    socket.disconnect()
    // localStorage.removeItem("token")
  }

  const data = {logOut, auth,socket, userDetails, fetchUserDetails,setUserDetails ,openUser, setOpenUser,activeUser, setAtiveUser};

  return (
    <AuthContext.Provider value={data}>
      {!loading ? children :  <div className=" flex justify-center h-[80vh] items-center">
             <CgSpinner  className="text-2xl animate-spin" />Loding...
            </div>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
