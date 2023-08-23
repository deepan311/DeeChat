import React, { useEffect, useRef, useState } from "react";
import ProfilePic from "../asset/ProfilePic.jpg";
import Message from "./HelperCom/Message";
import { BiLoader } from "react-icons/bi";
import io from "socket.io-client";
import Picker from "emoji-picker-react"

import {
  BsFillEmojiSmileFill,
  BsFillSendFill,
  BsArrowLeftShort,
} from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../Auth";

// const socket = io.connect(process.env.REACT_APP_API_URL);

function ChatBox({ active }) {
  // console.log(Id);

  const navigate = useNavigate();

  // const [conect, setconect] = useState({ stats: false, conId: null });
  const [load, setload] = useState(false);
  const [msg, setmsg] = useState([]);

  const [textMsg, settextMsg] = useState("");
  const [emojiShow, setEmojiShow] = useState(false);

  const emojiRef= useRef()

  const chatContainerRef = useRef(null);
  const { socket, userDetails, openUser, setOpenUser } = useAuthContext();

  const Id = openUser.userData.googleId;
  // console.log(msg)

  useEffect(() => {
    const receiveMsgHandler = (data) => {
      if (Id === data.senderId) {
        setmsg((msg) => [...msg, data]);
      }
    };

    socket.on("reciveMsg", receiveMsgHandler);

    return () => {
      socket.off("reciveMsg", receiveMsgHandler);
    };
  }, [socket]);

  const chatFetch = async () => {
    setload(true);
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/chat/fetchchat`,
        { reciverId: Id },
        { headers: { token: localStorage.getItem("token") } }
      )
      .then((res) => {
        // setconect({ stats: true, conId: res.data._id });
        // console.log(res)
        setmsg(res.data.message);
        setload(false);
      })
      .catch((err) => {
        console.log(err);
        setload(false);
      });
  };

  // console.log(msg)

  const addMsg = async (msg) => {
    await axios
      .put(
        `${process.env.REACT_APP_API_URL}/chat/addmsg`,
        { reciverId: Id, msg },
        { headers: { token: localStorage.getItem("token") } }
      )
      .then((res) => {
        console.log("res", res.data.data);

        // setmsg({...msg},{senderId:userDetails.googleId,reciverId:Id.deepan,text:msg})
      })
      .catch((err) => {
        console.log(err, "somthing error");
      });
  };

  useEffect(() => {
    chatFetch();
    setmsg([]);

    return () => chatFetch();
  }, [openUser.userData]);

  const clearLast = async () => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/chat/clearlast`,
      { reciverId: Id },
      { headers: { token: localStorage.getItem("token") } }
    ).then(res=>{
      
    }).catch(err=>{
      console.log(err)
    })
  };

  useEffect(() => {
    socket.on("reciveMsg", (data) => {
      clearLast()
    });
  }, [socket]);

  useEffect(() => {
    // Scroll to the bottom when the component is loaded
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [msg]);

  useEffect(() => {
    document.addEventListener("mousedown", (event)=>{
      if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiShow(false)

      }
    });
    return () => {
      document.removeEventListener("mousedown", (event)=>{});
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg =textMsg.trim();
    e.target.reset();
    if (msg === "") {
      return null;
    }

    const sendMsg = {
      createdAt: Date.now(),
      senderId: userDetails.googleId,
      reciverId: Id,
      text: msg,
    };
    socket.emit("sendMsg", sendMsg);
    setmsg((pre) => [...pre, sendMsg]);

    addMsg(msg);
   settextMsg("")
    openUser.ManualUpdateTime(Id);

  };

  const deleteCoversation = async ({ username, id }) => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/chat/delchat`, {
        delUserName: username,
        gId: id,
      })
      .then((res) => {});
  };

  const emojiAdd = (obj)=>{
    settextMsg(pre=>pre+obj.emoji)

  }

  return (
    <div className="w-full mt-16 h-[calc(92vh-5px)] relative bg-[#D9D9D9]">
      <div
        className="w-full py-3 rounded-lg flex items-center"
        style={{ backgroundColor: "rgba(50, 71, 94, 0.91)" }}
      >
        <BsArrowLeftShort
          className="text-white text-3xl mx-2 cursor-pointer"
          onClick={() => {
            setOpenUser({ stats: false, userData: null });
          }}
        />
        <img
          src={openUser.userData.profilePic}
          className="rounded-full mx-2 w-10"
          alt=""
        />
        <h3 className="text-white px-3 font-bold text-xl">
          {openUser.userData.name}
        </h3>

        <div
          className={`w-3 h-3 rounded-full ${
            active ? "bg-green-500" : "bg-red-500"
          } `}
        />
      </div>

      <div
        ref={chatContainerRef}
        className="h-[74vh] hide-scrollbar w-full bg-[#D9D9D9] py-3 overflow-y-auto"
      >
        {load && (
          <div className="w-full flex justify-center pt-10">
            {" "}
            <BiLoader className="text-2xl animate-spin" />
          </div>
        )}
        {msg.length != 0 && (
          <>
            {" "}
            {msg.map((item, index) => {
              return (
                <Message
                  key={index}
                  self={userDetails.googleId == item.senderId}
                  data={item}
                />
              );
            })}
          </>
        )}
      </div>
           {emojiShow &&  <div ref={emojiRef} className="  absolute bottom-16 " >
            <Picker width="100%" onEmojiClick={emojiAdd} />
            </div>}
    

      <form action="" onSubmit={handleSubmit}>
        <div className="lg:left-32  w-full lg:w-auto bg-gray-700 justify-between flex items-center rounded-full h-12 lg:right-32 fixed lg:absolute bottom-2">
          <BsFillEmojiSmileFill onClick={()=>{setEmojiShow(!emojiShow)}} className="cursor-pointer absolute text-xl text-gray-700 left-3" />
          <input
            name="msg"
            type="text"
            value={textMsg}
            onChange={(e)=>settextMsg(e.target.value)}
            placeholder="Type message....."
            className="flex-grow px-11 outline-none shadow-xl h-full rounded-full rounded-r-none"
          />
          <button
            type="submit"
            className="px-8 text-white justify-center font-bold flex items-center gap-2"
          >
            {" "}
            <BsFillSendFill />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;

// ========change user name to reciver id
