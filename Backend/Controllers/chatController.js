const User = require("../DB/Models/UserModels");

const Chat = require("../DB/Models/ChatModels");

exports.makeConnection = async (req, res) => {
  try {
    const { conUserName } = req.body;

    if (!conUserName) {
      return res.status(400).send("User name illa da venna");
    }
    const userData = req.data;

    if (userData.username === conUserName) {
      return res.status(400).send("same Id Does not friend exist ");
    }

    const friendData = await User.findOne({ username: conUserName });

    if (!friendData) {
      return res.send({
        status: false,
        msg: "lei somba un friend illa da DB la",
      });
    }

    const friendListExist = await User.findOne({
      username: userData.username,
      friendList: { $in: friendData.googleId },
    });

    if (friendListExist) {
      return res.status(400).send("Already Un Nanban tha da avan ");
    }

    const response1 = await User.findOneAndUpdate(
      { username: userData.username },
      { $push: { friendList: friendData.googleId } }
    );
    const response2 = await User.findOneAndUpdate(
      { username: conUserName },
      { $push: { friendList: userData.googleId } }
    );

    if (!response1 && !response2) {
      return res.status(400).send("Friends creating problem");
    }

    const conversationExist = await Chat.findOne({
      member: { $all: [friendData.googleId, userData.googleId] },
    });

    if (!conversationExist) {
      const conversationAdd = await Chat.create({
        member: [friendData.googleId, userData.googleId],
      });
      if (!conversationAdd) {
        return res.status(400).send("Already Maked Conversation");
      }
    }
    return res.status(200).send({ status: true, msg: "Conversation created" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addmessage = async (req, res) => {
  const userData = req.data;
  const { reciverId, msg } = req.body;
  if (!reciverId && !msg) {
    return res.status(400).send({
      status: false,
      msg: "Data olunga anupu da venna :Username illa, msg illa",
    });
  }

  const text = msg.trim();
  const temp = { senderId: userData.googleId, reciverId, text };
  const lastMsg = temp
  lastMsg.createdAt = Date.now()

  //   const oppData=await findOne({username})

  const addMsg = await Chat.findOneAndUpdate(
    { member: { $all: [userData.googleId, reciverId] } },
    { $push: { message: temp } ,lastMessage:{status : true , msg : lastMsg}}
  );
  if (addMsg) {
    // const newMsg=addMsg.message[addMsg.message.length -1]
    // console.log(addMsg)

    res.status(200).send({ status: true, msg: "add msg succsess" });
  } else {
    res
      .status(400)
      .send({ status: false, msg: "He is not your Friend Make Connection" });
  }
};

exports.fetchChat = async (req, res) => {
  try {
    const userData = req.data;

    const { reciverId,slice=-10 } = req.body;
    const currentList = await User.findOne({ username: userData.username });

    if (!currentList.friendList.includes(reciverId)) {
      return res.status(400).send("user not your  Friends");
    }

    // const slice=req.body.slice || 20 =====>SLICE SOON...

    const response = await Chat.findOne(
      {
        member: { $all: [userData.googleId, reciverId] },
      },
      // { message: { $slice: slice } }
    );

 

    if (!response) {
      return res.status(400).send("Chat illa bro");
    }

    if(response.lastMessage.status && response.lastMessage.msg.senderId === reciverId){
      const clearLast = await Chat.findOneAndUpdate({ member: { $all: [userData.googleId, reciverId] }},{lastMessage:{status:false,msg:null}})

      if(!clearLast){
        
      return res.status(400).send("Last Message not clear");
        
      }

    }
    res.send(response).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

exports.fetchFriends = async (req, res) => {
  userData = req.data;
  const { reciverIds } = req.body;
  if (!reciverIds) {
    return res.status(400).send("No reciver Id");
  }
  try {
    const response = await User.find({ googleId: { $in: reciverIds } }).select(
      "-friendList"
    );

    if (!response) {
      return res.status(400).send("no friends somthing wrong");
    }

    res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.searchUser = async (req, res) => {
  const { q } = req.query;
  const userData = req.data;

  if (!q) {
    return res.send(null);
  }

  try {
    const regex = new RegExp(q, "i"); // 'i' flag for case-insensitive search
    const searchResult = await User.find({
      username: { $regex: regex },
    }).select("-friendList");
    const connectedUser = [];
    const otherUser = [];
    if (searchResult.length === 0) {
      return res.status(200).send({ connectedUser, otherUser });
    }

    const curUser = await User.findOne({ username: userData.username });

    if (!curUser) {
      res.status(400).send("No Current user");
    }
    const filterSearchResults = async () => {
      for (const item of searchResult) {
        if (curUser.friendList.includes(item.googleId)) {
          connectedUser.push(item);
        } else {
          if (curUser.googleId !== item.googleId) {
            otherUser.push(item);
          }
        }
      }
    };
    filterSearchResults();

    return res.status(200).send({ connectedUser, otherUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteConvercation = async (req, res) => {
  const userData = req.data;

  try {
    const { delUserName, gId } = req.body;

    if (!delUserName || !gId) {
      return res.status(400).send("no User Name and gId ");
    }

    const response1 = await User.findOneAndUpdate(
      { username: userData.username },
      { $pull: { friendList: gId } }
    );

    const response2 = await User.findOneAndUpdate(
      { username: delUserName },
      { $pull: { friendList: userData.googleId } }
    );

    if (!response1 || !response2) {
      return res.status(400).send("friendlist deleting error");
    }

    const del = await Chat.findOneAndDelete({
      $and: [{ member: gId }, { member: userData.googleId }],
    });

    if (!del) {
      return res.status(400).send("connection chat deleting error");
    }

    res.status(200).send("deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.fetchConversation = async (req, res) => {
try {
  const userData = req.data;

  const curData = await User.findOne({ googleId: userData.googleId });

  const friendList = curData.friendList;

  const conversationData = [];
  for (let i = 0; i < friendList.length; i++) {
    const response = await Chat.findOne(
      {
        member: { $all: [curData.googleId, friendList[i]] },
      }
    ).select("-message")
    const friendresponse = await User.findOne({
      googleId: friendList[i],
    }).select("-friendList");

    conversationData.push({ conversation: response, userInfo: friendresponse });
  }

  res.send(conversationData);
} catch (error) {
  res.status(500).send(error)
}
};

exports.clearLast = async(req,res)=>{
  try {
    const userData  = req.data
    const {reciverId} = req.body

    const response = await Chat.findOne(
      {
        member: { $all: [userData.googleId, reciverId] },
      },
      // { message: { $slice: slice } }
    );

    if(response.lastMessage.status && response.lastMessage.msg.senderId === reciverId){
      const clearLast = await Chat.findOneAndUpdate({ member: { $all: [userData.googleId, reciverId] }},{lastMessage:{status:false,msg:null}})


      if(!clearLast){
      return res.status(400).send("no Chat Last")
        
      }
     return res.status(200).send("Removed successfully")
    }
    return res.status(200).send(" Already Removed ")

  } catch (error) {
  res.status(500).send(error)
    
  }
}


