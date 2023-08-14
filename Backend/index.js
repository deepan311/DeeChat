const express = require("express");
const userRouter = require("./Routes/userRouter");
const app = express();
const path = require("path")
require("dotenv").config();
app.use(express.json());
const DB = require("./DB/database");
const passport = require("passport");
const session = require("express-session");
const chatRouter = require("./Routes/chatRouer");
// const router= require("./Routes/gAuth")

const socket = require("socket.io");

const cors = require("cors");

//==========GOOGLE=========
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ======MIDDILEWARE===========

app.use(cors({ origin: ["http://localhost:3000" ,  "http://localhost:8000"], }));

// ======ROUTER=================
app.use("/api/login", userRouter);
app.use("/api/chat", chatRouter);

//========DB Connextion==========
DB.then((result) => {
  console.log("DB Connect Successfully");
}).catch((err) => {
  console.log("error", err);
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => { 
  const indexPath = path.join(__dirname, '../client/build', 'index.html');
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// =======SERVER RUNNING=========
const server = app.listen(process.env.PORT, () => {
  console.log("server running ", process.env.PORT);
});


var activeUser = [];
const addactive = (id, username) => {
  const exist = activeUser.find(
    (item) => item.username == username || item.id == id
  );

  if (exist) {
    if (exist.id != id) {
      activeUser = activeUser.map((it) => (it.id = id));
    }
    return "user exist";
  }

  activeUser.push({ id, gId: username });
};

const RemoveActive = (id) => {
  activeUser = activeUser.filter((item) => item.id !== id);
};

const io = socket(server, { cors: `*` });

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  socket.on("active", (data) => {
    // console.log(data);
    addactive(socket.id, data);
    io.emit("active", activeUser);
  });

  // console.log(activeUser)
  socket.on("sendMsg", (data) => {
    // console.log(data)
    const getUser = activeUser.find((item) => item.gId === data.reciverId);
    // console.log("getUser",getUser)
    if (getUser) {
      io.to(getUser.id).emit("reciveMsg", data);
    }
  });

  socket.on("disconnect", (reason, details) => {
    console.log("disconnect ", reason); // 400
    console.log("disconect details", socket.id); // '{"code":1,"message":"Session ID unknown"}'

    RemoveActive(socket.id);
    io.emit("active", activeUser);
  });
});
