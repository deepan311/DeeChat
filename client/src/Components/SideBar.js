import React, { useState, useRef, useEffect } from "react";
// import { ReactComponent as SearchIcon } from "../asset/CustomIcon/Search.svg";

import { RiSearch2Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { ReactComponent as AdduserIcon } from "../asset/CustomIcon/AddUser.svg";
import { calcLength, motion } from "framer-motion";
import User from "./HelperCom/User";
import ChatBox from "./ChatBox";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Auth";
import axios from "axios";
import MakeConnection from "./HelperCom/MakeConnection";
import { CgSpinner } from "react-icons/cg";
import Profile from "./Profile";

function SideBar({ profile, setprofile }) {
  const [openSearch, setopenSearch] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [load, setload] = useState(false);
  const inputRef = useRef();
  const [makeCon, setMakeCon] = useState(false);
  const navigate = useNavigate();
  const { userDetails, activeUser, socket, openUser } = useAuthContext();
  const [error, seterror] = useState({ status: false, msg: "" });
  const [arrive, setarrive] = useState([]);

  //  console.log(friendsList)

  // const fetchFriends = async (ids) => {
  //   setload(true);

  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/chat/fetchfriends`,
  //       { reciverIds: ids },
  //       {
  //         headers: { token: localStorage.getItem("token") },
  //       }
  //     );
  //     if (res.status == 200) {
  //       seterror({ status: false, msg: "" });
  //       setFriendsList(res.data);
  //       setload(false);

  //       return;
  //     }
  //     seterror({ status: true, msg: res.response.data || "error" });
  //     setload(false);
  //   } catch (error) {
  //     seterror({ status: true, msg: error.response.data || "error" });

  //     setload(false);
  //   }
  // };

  const conversation = async () => {
    setload(true);
    const list = await axios.get(
      `${process.env.REACT_APP_API_URL}/chat/fetchconversation`,
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
    if (list.status === 200) {
      const sort = sortArray(list.data);
      setFriendsList(sort);
      setload(false);
      return;
    }
    setload(false);
    seterror({ status: true, msg: list.response.data || "error" });
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setopenSearch(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortArray = (arr) => {
    const newSort = arr.sort(
      (a, b) =>
        new Date(b.conversation.updatedAt) - new Date(a.conversation.updatedAt)
    );
    return newSort;
  };

  const ManualUpdateTime = (id) => {
    const now = new Date();

    // Get individual components of the date and time
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = now.getUTCDate().toString().padStart(2, "0");
    const hours = now.getUTCHours().toString().padStart(2, "0");
    const minutes = now.getUTCMinutes().toString().padStart(2, "0");
    const seconds = now.getUTCSeconds().toString().padStart(2, "0");
    const milliseconds = now.getUTCMilliseconds().toString().padStart(3, "0");

    // Create the formatted date-time string
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    const updateManual = friendsList.map((item) => {
      if (item.userInfo.googleId == id) {
        return {
          ...item,
          conversation: {
            ...item.conversation,
            updatedAt: formattedDateTime,
          },
        };
      } else {
        return item;
      }
    });
    if (updateManual.length == 0) {
      console.log("Id Not valid");
      return null;
    }
    setFriendsList(sortArray(updateManual));

    console.log("manual", friendsList);
  };

  // useEffect(() => {

  //    const sort= sortArray(friendsList)
  //    setFriendsList(sort)

  // }, [friendsList]);

  useEffect(() => {
    if (userDetails) {
      // fetchFriends(userDetails.friendList);
      conversation();
    }
  }, [userDetails]);

  useEffect(() => {
    if (openSearch) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  useEffect(() => {
    socket.on("reciveMsg", (data) => {
      setarrive([...arrive, data]);

      ManualUpdateTime(data.senderId);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("delete", (data) => {
      if (friendsList.length != 0) {
        const updatedList = friendsList.filter(
          (item) => item.userInfo.googleId != data.senderID
        );
        console.log("update", updatedList);

        setFriendsList(updatedList);
      }
    });
  }, [socket, friendsList]);

  return (
    <div className="w-full max-h-[calc(91vh-4px)] relative mt-[69px] flex flex-col shadow-2xl  bg-[#F2ECFF]">
      <div className=" overflow-hidden">
        {/* SEARCHBAR=============== */}
        <div
          className="p-3 rounded-full mx-2  flex justify-between"
          style={{
            backgroundColor: "rgba(50, 71, 94, 0.91)",
            boxShadow: "1px 1px 3px 3px rgba(81,81,81,0.75)",
          }}
        >
          <RiSearch2Line
            onClick={() => {
              setopenSearch(true);
            }}
            className={`${openSearch && "hidden"} text-2xl text-white`}
          />
          {openSearch && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: openSearch ? "90%" : "auto" }}
              transition={{ duration: 0.5 }}
              className={`overflow-hidden  text-gray-500 items-center  flex justify-between py-1 px-2  rounded-full bg-white `}
            >
              <input
                type="text"
                className="w-full text-gray-500 outline-none"
                placeholder="Search User"
                ref={inputRef}
              />
              <RiSearch2Line className="text-2xl mx-1 cursor-pointer" />
              <RxCross2
                onClick={() => setopenSearch(false)}
                className="text-2xl mx-1 cursor-pointer"
              />
            </motion.div>
          )}
          <h2
            className={`${
              openSearch ? "hidden" : "block"
            } text-white font-bold`}
          >
            Heyy {userDetails && userDetails.name}
          </h2>
          <AdduserIcon
            onClick={() => setMakeCon(true)}
            className={`${openSearch && "my-1"} cursor-pointer`}
          />
        </div>
        <div
          className="w-full  overflow-y-auto mt-2 hide-scrollbar h-[100vh] "
          style={{ boxShadow: "2px 8px 7px -4px rgba(81,81,81,0.75)" }}
        >
          {error.status && (
            <div className="pt-16 flex justify-center h-[80vh] items-center">
              {error.msg}
            </div>
          )}

          {load ? (
            <div className="pt-16 flex justify-center h-[80vh]  items-center">
              <CgSpinner className="text-2xl animate-spin" />
              Loding...
            </div>
          ) : (
            <>
              {friendsList.map((i, j) => (
                <User
                  setarrive={setarrive}
                  arrive={arrive}
                  key={j}
                  data={i.userInfo}
                  ManualUpdateTime={ManualUpdateTime}
                  active={
                    activeUser.includes(i.userInfo.googleId) ? true : false
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* NO FRIENDS */}

      {!load && friendsList.length == 0 && (
        <div className="absolute flex-col gap-4  w-full items-center mt-16 flex h-[calc(100vh-250px)]  justify-center">
          <h3 className="text-sm jonh-font">
            No Frirend's available Make Connection with your friends
          </h3>
          <button
            onClick={() => setMakeCon(true)}
            className="bg-blue-500 rounded-md jonh-font text-sm px-4 py-2 shadow-md hover:bg-blue-400"
          >
            Make Connection
          </button>
        </div>
      )}

      {/* //MAKE CONNECTION============= */}

      <div
        className={`fixed w-full flex justify-center z-50 h-full py-5 bg-black/70 ${
          makeCon ? "block" : "hidden"
        } `}
      >
        <MakeConnection setMakeCon={setMakeCon} />
      </div>

      {/* Profile================== */}

      <div
        className={`${
          profile ? "block" : "hidden"
        } fixed w-full flex justify-center z-50 h-full py-5 bg-black/70`}
      >
        <Profile
          setprofile={setprofile}
          setMakeCon={setMakeCon}
          friendsList={friendsList}
          setFriendsList={setFriendsList}
        />
      </div>
    </div>
  );
}

export default SideBar;
