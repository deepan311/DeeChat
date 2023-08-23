import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";
import { IoMdChatbubbles } from "react-icons/io";
import { useAuthContext } from "../Auth";

function Home() {
  const { openUser, setOpenUser, socket, activeUser } = useAuthContext();
  const [profile, setprofile] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <NavBar profile={profile} setprofile={setprofile} />
      <div className="grid h-screen grid-cols-12 w-full">
        <div className="col-span-12 lg:col-span-3">
          <SideBar profile={profile} setprofile={setprofile} />
        </div>

        {/* <div className="hidden lg:block lg:col-span-9">
        {openUser.status && <ChatBox/>}

        </div> */}

        <div className=" absolute top-0 z-0 right-0 left-0 lg:relative lg:col-span-9">
          {openUser.status && (
            <ChatBox
              active={
                activeUser.includes(openUser.userData.googleId) ? true : false
              }
            />
          )}
      <div className="w-full h-full flex flex-col justify-center items-center">
      {!openUser.status &&   <div className="hidden lg:block  ">
            {" "}
            <IoMdChatbubbles className="text-[20vh] text-slate-400" />
            <h3 className="jonh-font text-md">No Chat Available</h3>
          </div>}
      </div>
        </div>
      </div>
    </>
  );
}

export default Home;
