import React, { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../asset/CustomIcon/logo2.svg";
import { ReactComponent as ProfileIcon } from "../asset/CustomIcon/dummyProfile.svg";
import { useAuthContext } from "../Auth";
import { useNavigate } from "react-router-dom";

function NavBar({ setprofile}) {
  const { logOut, userDetails } = useAuthContext();
  const [pic, setPic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      setPic(userDetails.profilePic);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("token")
    logOut();
    navigate("/login");
  };
  return (
    <div
      className="cursor-pointer w-full h-16 bg-gradient-to-r fixed top-0 from-[#DEDEDE] z-10 flex justify-between items-center to-[rgba(67, 101, 90, 0)] "
      style={{ boxShadow: "0px 3px 4px 0px rgba(81,81,81,0.75)" }}
    >
      <Logo className="h-14" />
      <div className="px-5  gap-7 flex items-center">
        <h2
          className="jonh-font font-semibold cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          SignOut
        </h2>
        <div className="w-10 h-10">
          <img onClick={()=>{setprofile(true)}} src={pic} alt="alt" className="w-full rounded-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
