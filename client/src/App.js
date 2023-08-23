import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Redirect from "./Components/HelperCom/Redirect";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useAuthContext } from "./Auth";






function App() {
  const {socket, activeUser,setAtiveUser, userDetails, fetchUserDetails, auth } = useAuthContext();

  const fetchData = async (token) => {
    try {
      const res = await fetchUserDetails(token);
      if (res.status !== 200){
      localStorage.removeItem("token")

      }
    } catch (error) {
      localStorage.removeItem("token")
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (!userDetails && localStorage.getItem("token")) {
      fetchData(localStorage.getItem("token"));
    }
  }, []);


  useEffect(() => {
  if(userDetails){
    socket.emit("active",userDetails.googleId)

    socket.on("active",(data)=>{
      // console.log(data)
      
        const actiUser= data.map(item=>item.gId)
        setAtiveUser(actiUser)
    
    })
  }
   
  }, [socket]);

  // console.log("activeUser",activeUser)

  return (

    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route
        exact
        path="/*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/redirect/:token" element={<Redirect />} />
    </Routes>
  );
}

export default App;
