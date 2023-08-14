const express= require("express")
const { makeConnection, addmessage, fetchChat, fetchFriends, searchUser, deleteConvercation, fetchConversation } = require("../Controllers/chatController")
const { verifyToken } = require("../Controllers/Middleware")

const chatRouter = express.Router()


chatRouter.post('/makeconnection',verifyToken,makeConnection)  //auth, body-contains{conUserName:"username"}
chatRouter.put('/addmsg',verifyToken,addmessage)  //auth, body-contains{reciverId:"googleId",msg:"hey buddy"}
chatRouter.post('/fetchchat',verifyToken,fetchChat) // auth body-contain{reciverID}
chatRouter.post('/fetchfriends',verifyToken,fetchFriends) // auth body-contain{reciverIds as array}
chatRouter.get('/searchuser',verifyToken,searchUser) // auth param q="search query"
chatRouter.delete('/delchat',verifyToken,deleteConvercation) // auth , body = {delUserName,gId}
chatRouter.get('/fetchconversation',verifyToken,fetchConversation) // auth , body = {delUserName,gId}

module.exports=chatRouter