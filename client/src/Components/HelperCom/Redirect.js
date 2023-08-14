import React, { useState, useEffect, useContext } from "react";
import { Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../Auth";

function Redirect() {
  const { token } = useParams();

  const navigate=useNavigate()

  const { userdetails, fetchUserDetails } = useAuthContext();
  const [load, setload] = useState(true);
  const [redirect, setredirect] = useState(false);

  const fetch = async () => {
    setload(true);
    const res = await fetchUserDetails(token);
    console.log(res);
    if (res.status == 200) {
      localStorage.setItem("token", token);
      navigate("/",{state:token,replace:true})
      setredirect(true);
      return
    }
    navigate("/login")
    console.log(res);
    localStorage.removeItem("token");
    setload(false);
  };
  useEffect(() => {
    fetch();
  }, []);

  if (load) {
    return <>Loding redirect....</>;
  }
}

export default Redirect;
