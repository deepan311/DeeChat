import React, { useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Auth";


function Home() {

  const {openUser, setOpenUser,socket,activeUser} =useAuthContext()


  useEffect(() => {
  
    
  }, []);


  return (
    <>
      <NavBar />
      <div className="grid h-screen grid-cols-12 w-full">
        <div className="col-span-12 lg:col-span-3">
          <SideBar />
        </div>

        {/* <div className="hidden lg:block lg:col-span-9">
        {openUser.status && <ChatBox/>}

        </div> */}

        <div className=" absolute top-0 z-0 right-0 left-0 lg:relative lg:col-span-9">
          {openUser.status && <ChatBox active={activeUser.includes(openUser.userData.googleId) ? true :false} />}
        
        </div>

      </div>
    </>
  );
}

export default Home;
