import React ,{useState}from "react";
import Logo from "../asset/logo.png";
import { ReactComponent as Google } from "../asset/CustomIcon/google.svg";
import { ReactComponent as ChatIcon } from "../asset/CustomIcon/chat.svg";
import { useAuthContext } from "../Auth";
import { Navigate, useNavigate,useLocation } from "react-router-dom";
function Login() {
  const [load, setload] = useState(false);

  const {userDetails} =useAuthContext()

  const token=useLocation()
  console.log(token)
  console.log(userDetails)

  const login = async () => {
    setload(true);
    await window.location.replace(`${process.env.REACT_APP_API_URL}/login`);
    setload(false);
  };

  if(localStorage.getItem("token")){
    return (<Navigate to="/" />)
  }

  

  return (
    <div className="w-full h-full p-5">
      <div
        className="w-full h-[93vh]  rounded-md  flex bg-[#D9D9D9] gap-10 flex-col py-10 items-center"
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 3px 0px" }}
      >
        <img src={Logo} alt="logo" className="w-[40vh]" />
        <div
          onClick={() => {
            login();
          }}
          className="bg-white flex justify-around shadow-md hover:shadow-2xl cursor-pointer hover:bg-white/80 items-center py-3 px-6  rounded-full"
        >
          <Google className="px-1" />
          <h2 className="px-2 font-medium">{load?"Loding...":"SignIn With Google"}</h2>
        </div>
        <h2 className="text-[#5D5D5D] text-center my-16 jonh-font flex gap-2 font-medium">
          Let’s Make Conversation with your Buddy <ChatIcon className="w-5" />
        </h2>
      </div>
    </div>
  );
}

export default Login;
