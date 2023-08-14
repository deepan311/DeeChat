import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import ProfilePic from "../../asset/ProfilePic.jpg";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Auth";
import {BsMessenger} from "react-icons/bs"

function User({ data, active, arrive, setarrive ,ManualUpdateTime}) {
  const navigate = useNavigate();
  const { name, profilePic, googleId, username } = data;
  const { openUser, setOpenUser, activeUser } = useAuthContext();
  const [markRead, setMarkRead] = useState(false);
  // const [active, setActive] = useState(false);

  const [lastMsg, setlastMsg] = useState("");

  useEffect(() => {
    //  console.log(data)
    arrive.map((item) => {
      if (item.senderId == data.googleId) {
        if(!openUser.status ||openUser.userData.googleId!=item.senderId){
          setMarkRead(true);
          // setlastMsg(item.text);
        }else{
          const filterArrive = arrive.filter(
            (item) => item.senderId !== data.googleId
          );
          setarrive(filterArrive);
        }
      }
    });
    
    

  }, [arrive]);

  return (
    <div
      className="w-full h-18 flex  relative items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#C8FCEA]  bg-[#F2ECFF]"
      onClick={() => {
        setOpenUser({ status: false, userData: null });
        setOpenUser({ status: true, userData: data  ,ManualUpdateTime});
        setMarkRead(false);
        const filterArrive = arrive.filter(
          (item) => item.senderId !== data.googleId
        );
        setarrive(filterArrive);
      }}
    >
      <div className="">
        <img src={profilePic} className="rounded-full w-14" alt="" />
      </div>
      <div className="flex-grow  px-4">
        <h3 className="text-lg jonh-fon font-semibold">{name}</h3>
        <h3 className="text-[11px] text-gray-600">
          {lastMsg}{" "}
          {markRead && (
            <span className="font-bold text-black flex items-center gap-2">New message <BsMessenger/> </span>
          )}
        </h3>
      </div>
     
      <div className="flex flex-col items-center gap-2">
        {" "}
        <div
          className={`w-3 h-3 rounded-full ${
            active ? "bg-green-500" : "bg-red-500"
          } `}
        />{" "}
        <h3 className="text-[10px] text-gray-600">
          {active ? "Active" : "Offline"}
        </h3>
      </div>

      <div className="absolute h-[1px] border-r border-black mr-2 left-10 right-10 bg-slate-400 bottom-0" />
    </div>
  );
}

export default User;
