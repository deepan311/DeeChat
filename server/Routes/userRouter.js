const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../DB/Models/UserModels");

const { login, callback, fetchData } = require("../Controllers/userController");
const { verifyToken } = require("../Controllers/Middleware");
const session = require("express-session");
require("dotenv").config();

// const app = express();
// const router = express.Router()

// router.use(
//   session({
//     secret: "deepan",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// const SECRET_KEY = process.env.SECRET;
// app.use(passport.initialize());
// app.use(passport.session());

// const jsonData = (condition, msg, result = null) => {
//   return { status: condition, msg, result };
// };

passport.serializeUser(function (user, done) {
  //   console.log("serializ",user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("deserializ", user);

  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "811398230314-kg8kfbcn5hd4moj12oq1rtqv91afejus.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/login/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const userexist = await User.findOne({ googleId: profile.id });

      if (!userexist) {
       
        const email = profile.emails[0].value;

        const setUserName = (email) => {
          let index = email.indexOf("@");
          return email.slice(0, index);
        };
        const username = setUserName(email);

        const newData = {
            googleId: profile.id,
            name: profile.displayName,
            profilePic: profile.photos[0].value,
            username,
            email,
        };
        const createUser = await User.create(newData);

        return done(null, createUser);
      }

      return done(null, userexist);
    }
  )
);

userRouter.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/callback",
  passport.authenticate("google", { failureMessage: "FailedAuth" }),
  callback
);

userRouter.get("/fetchdata", verifyToken, fetchData); // auth

module.exports = userRouter;
