import React, { Children, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Auth";

function ProtectedRoute({children}) {
  const { userDetails , auth,fetchUserDetails} = useAuthContext();


//   if(localStorage.getItem("token") || userDetails && auth){
//     return (<Navigate to="/" />)
//   }

// const fetchData = async (token) => {
//   try {
//     const res = await fetchUserDetails(token);
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//   }
// };

// useEffect(() => {
//   if ( localStorage.getItem("token")) {
//     fetchData(localStorage.getItem("token"));
//   }
// }, []);



  if(localStorage.getItem("token") || userDetails ){
    return children
  }else{
    return (<Navigate to="/login"/>)
  }

  
}

export default ProtectedRoute;
