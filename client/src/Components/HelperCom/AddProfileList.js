import React, { useState } from "react";
import { MdOutlineMobileFriendly } from "react-icons/md";
import { BiLoader } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useAuthContext } from "../../Auth";
import axios from "axios";

function AddProfileList({ searchList, setInput }) {




  return (
    <>
      {searchList.connectedUser && searchList.connectedUser.length > 0 && (
        <>
          {searchList.connectedUser.map((i, j) => (
            <div
              key={j}
              className="w-full h-18 flex relative items-center justify-between px-5 py-4  hover:bg-[#C8FCEA] bg-[#F2ECFF]"
            >
              <div className="">
                <img src={i.profilePic} className="rounded-full w-14" alt="" />
              </div>
              <div className="flex-grow  px-4">
                <h3 className="text-lg jonh-fon font-semibold">{i.name}</h3>
                <h3 className="text-[11px] text-gray-400">{i.username}</h3>
              </div>

              <div className="flex flex-col text-green-500  items-center gap-2">
                {" "}
                <MdOutlineMobileFriendly className={`text-2xl`} />
                <h3 className="text-[10px] text-gray-600">Connected</h3>
              </div>
              <div className="absolute h-[1px] border-r border-black mr-2 left-10 right-10 bg-slate-400 bottom-0" />
            </div>
          ))}
        </>
      )}

      {searchList.otherUser && searchList.otherUser.length > 0 && (
        <>
          {searchList.otherUser.map((i, j) => (
                <OtherUser  key={j} setInput={setInput}  i={i}/>
          ))}
        </>
      )}
    </>
  );
}

export default AddProfileList;


 

function OtherUser({ setInput ,i}) {
  const {setUserDetails} = useAuthContext()

    const [miniLoad, setMiniLoad] = useState(false);

    const makecon = async (username, googleId) => {
        setMiniLoad(true);
        try {
          await axios
            .post(
              `${process.env.REACT_APP_API_URL}/chat/makeconnection`,
              { conUserName: username },
              { headers: { token: localStorage.getItem("token") } }
            )
            .then((res) => {
              setUserDetails((pre) => ({
                ...pre,
                friendList: [...pre.friendList, googleId],
              }));
              setMiniLoad(false);
              setInput((pre) => pre + " ");
            });
        } catch (error) {
          console.log(error);
          setMiniLoad(false);
        }
      };
  return (
    <div
   
    className="w-full h-18 flex relative items-center justify-between px-5 py-4  hover:bg-[#C8FCEA] bg-[#F2ECFF]"
  >
    <div className="">
      <img src={i.profilePic} className="rounded-full w-14" alt="" />
    </div>
    <div className="flex-grow  px-4">
      <h3 className="text-lg jonh-fon font-semibold">{i.name}</h3>
      <h3 className="text-[11px] text-gray-400">{i.username}</h3>
    </div>
    {miniLoad ? (
      <>
        {" "}
        <div className="flex flex-col  items-center gap-2">
          <BiLoader className={`text-2xl animate-spin`} />
          <h3 className="text-[10px] text-gray-600">
            Make COnnection
          </h3>
        </div>
      </>
    ) : (
      <div
        onClick={() => {
          makecon(i.username, i.googleId);
        }}
        className="flex flex-col cursor-pointer  items-center gap-2"
      >
        {" "}
        <AiOutlineUserAdd className={`text-2xl`} />
        <h3 className="text-[10px] text-gray-600">Make COnnection</h3>
      </div>
    )}
    <div className="absolute h-[1px] border-r border-black mr-2 left-10 right-10 bg-slate-400 bottom-0" />
  </div>
  )
}


