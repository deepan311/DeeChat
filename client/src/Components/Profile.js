import React, { useState } from "react";
import Pro from "../asset/ProfilePic.jpg";
import { BsArrowLeftShort } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";
import { useAuthContext } from "../Auth";
import { useNavigate } from "react-router-dom";

function Profile({ setprofile, setMakeCon, friendsList, setFriendsList }) {
  const [deleteOpen, setdeleteOpen] = useState(false);
  const [miniLoad, setminiLoad] = useState({ status: false, curId: "" });

  const { userDetails, logOut,socket } = useAuthContext();
  const navigate = useNavigate();

  const deleteUser = async ({ userName, gId }) => {
    setminiLoad({ status: true, curId: gId });
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/chat/delchat`, {
        data: { delUserName: userName, gId },
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        const newFilter = friendsList.filter(
          (item) => item.userInfo.googleId != gId
        );
        setFriendsList(newFilter);
        setminiLoad({ status: false, curId: "" });
        socket.emit("delete",{senderID:userDetails.googleId,googleId:gId})
      })
      .catch((err) => {
        console.log(err);
        setminiLoad({ status: false, curId: "" });
      });
  };

  return (
    <div className="bg-white h-[70vh] relative w-[60vh] rounded-lg jonh-font p-7 flex flex-col items-center">
      <BsArrowLeftShort
        onClick={() => {
          setprofile(false);
        }}
        className="absolute left-4 top-4 text-3xl mx-2 cursor-pointer"
      />
      <img
        src={userDetails && userDetails.profilePic}
        alt=""
        className="w-[12vh] h-[12vh] rounded-full"
      />
      <h3 className="text-xl font-medium">{userDetails && userDetails.name}</h3>
      <h3 className="text-sm font-medium">
        {userDetails && userDetails.username}
      </h3>
      <h3 className="text-[11px] text-gray-600 font-medium">
        {userDetails && userDetails.email}
      </h3>

      <div
        onClick={() => {
          setMakeCon(true);
          setprofile(false);
        }}
        className="bg-slate-700 my-4 mt-16 w-[30vh] text-center rounded-md text-white py-2 cursor-pointer hover:bg-slate-600"
      >
        Add Conversation
      </div>

      <div
        onClick={() => {
          setdeleteOpen(true);
        }}
        className="bg-slate-700 my-4 w-[30vh] text-center rounded-md text-white py-2 cursor-pointer hover:bg-slate-600"
      >
        Delete Conversation
      </div>
      <div
        onClick={() => {
          logOut();
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="bg-slate-700 my-4 w-[30vh] text-center rounded-md text-white py-2 cursor-pointer hover:bg-slate-600"
      >
        Sign Out
      </div>

      {/* Delete================= Coversation */}
      <div
        className={` ${
          deleteOpen ? " block" : "hidden"
        } absolute bg-gray-200  top-0 bottom-0 w-full  rounded-lg jonh-font p-7 flex flex-col items-center `}
      >
        <BsArrowLeftShort
          onClick={() => {
            setdeleteOpen(false);
          }}
          className="absolute left-4 top-4 text-3xl mx-2 cursor-pointer"
        />

        <h4 className="text-xl">Friend List</h4>

        <div className="h-[70vh] w-full hide-scrollbar bg-white rounded-lg overflow-auto">
          {friendsList.map((item, j) => (
            <div
              key={j}
              className="w-full h-18 flex  relative items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#C8FCEA]  bg-[#F2ECFF]"
            >
              <div className="">
                <img
                  src={item.userInfo.profilePic}
                  className="rounded-full w-14"
                  alt=""
                />
              </div>
              <div className="flex-grow  px-4">
                <h3 className="text-lg jonh-fon font-semibold">
                  {item.userInfo.name}
                </h3>
                <h3 className="text-[11px] text-gray-600">
                  {item.userInfo.username}
                </h3>
              </div>

              <div className="flex flex-col items-center gap-2">
                {miniLoad.status && miniLoad.curId == item.userInfo.googleId ? (
                  <AiOutlineReload className="animate-spin" />
                ) : (
                  <MdDelete
                    onClick={() => {
                      deleteUser({
                        userName: item.userInfo.username,
                        gId: item.userInfo.googleId,
                      });
                    }}
                    className="text-2xl"
                  />
                )}
              </div>

              <div className="absolute h-[1px] border-r border-black mr-2 left-10 right-10 bg-slate-400 bottom-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
