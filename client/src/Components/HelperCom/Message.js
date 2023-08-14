import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

function Message({ self, data }) {
  const [time, settime] = useState(null);

  function formatTimeAgo(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);
    const msDiff = currentDate - targetDate;  


    if (msDiff < 20000) {
      return "just now";
    }

    return formatDistanceToNow(targetDate, { addSuffix: true });
  }

  useEffect(() => {
    const cur = formatTimeAgo(data.createdAt);
    settime(cur);

    const interval = setInterval(() => {
      const updatedTime = formatTimeAgo(data.createdAt);
      settime(updatedTime);
    }, 60000);

    return ()=> clearInterval(interval)
  }, [data.createdAt]);
  return (
    <div
      className={`flex ${self ? "justify-end" : "justify-start"} b w-full px-2`}
    >
      <div className="">
        <h3
          className={` py-3 px-3 rounded-lg ${
            self ? "rounded-tr-none" : "rounded-tl-none"
          } text-black font-semibold`}
          style={{
            boxShadow: "0px 3px 5px 0px rgba(81,81,81,0.75)",
            backgroundColor: "rgba(92, 124, 123, 0.22)",
          }}
        >
          {" "}
          {data.text}{" "}
        </h3>
        <h3
          className={`text-[10px] font-bold ${
            self ? "text-end" : "text-start"
          } py-2`}
        >
          {time}
        </h3>
      </div>
    </div>
  );
}

export default Message;
