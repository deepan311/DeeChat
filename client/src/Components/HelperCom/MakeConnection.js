import React, { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import ProfilePic from "../../asset/ProfilePic.jpg";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsArrowLeftShort } from "react-icons/bs";
import { MdOutlineMobileFriendly } from "react-icons/md";
import { IoIosListBox } from "react-icons/io";
import { BiLoader } from "react-icons/bi";
import axios from "axios";
import { useAuthContext } from "../../Auth";

import AddProfileList from "./AddProfileList";

function MakeConnection({ setMakeCon }) {
  const [input, setInput] = useState("");
  const [currentApi, setcurrentApi] = useState(null);

  const { userDetails, setUserDetails } = useAuthContext();

  const [searchList, setsearchList] = useState({});

  const [load, setload] = useState(false);
  const [miniLoad, setMiniLoad] = useState(false);

  const paramSearch = async (query) => {
    if (currentApi) {
      currentApi.cancel();
    }

    const cancelToken = axios.CancelToken.source();

    setcurrentApi(cancelToken);

    setload(true);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat/searchuser?q=${input}`,
        { headers: { token } }
      );
      if (res.status == 200) {
        setload(false);
        return setsearchList(res.data);
      }
      setload(false);

      console.log("somthing wrong client");
      console.log(res);
    } catch (error) {
      setload(false);

      console.log(error);
    }
  };

  useEffect(() => {
    paramSearch(input);
    if (!input) {
      setsearchList({});
    }
   
  }, [input]);



  return (
    <div className=" w-[calc(100vh-10vh)] relative bg-white/90 h-[87vh] rounded-md p-2  py-12 flex flex-col ">
      <div className="absolute top-3 left-4 cursor-pointer">
        <BsArrowLeftShort
          onClick={() => {
            
            setMakeCon(false);
            
          }}
          className="text-black text-3xl"
        />
      </div>

      <div
        className="p-3 rounded-sm mx-2  h-16 items-center flex justify-between"
        style={{
          backgroundColor: "rgba(50, 71, 94, 0.91)",
          boxShadow: "1px 1px 3px 3px rgba(81,81,81,0.75)",
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="flex-grow py-1 rounded-md px-3 outline-none"
          placeholder="Search friends username"
        />
        <RiSearch2Line className={` mx-3 cursor-pointer text-2xl text-white`} />
      </div>

      <div className="p-3 w-full overflow-auto hide-scrollbar">
        {load ? (
          <div className="flex w-full h-[40vh] justify-center text-2xl items-center text-gray-500">
            <BiLoader className="animate-spin" />
          </div>
        ) : (<AddProfileList searchList={searchList} setInput={setInput} />
        )}

        {!searchList && !load && (
          <div className="flex w-full h-[40vh] justify-center text-xl items-center text-gray-500">
            {" "}
            <RiSearch2Line className="mx-3" /> Search User
          </div>
        )}

        {searchList.otherUser && searchList.otherUser.length == 0 && (
          <div className="flex w-full h-[40vh] justify-center text-xl items-center text-gray-500">
            {" "}
            No Other User Found <IoIosListBox className="mx-3" />
          </div>
        )}
      </div>
    </div>
  );
}

export default MakeConnection;
