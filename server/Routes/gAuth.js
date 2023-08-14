// const express = require("express");
// const passport = require("passport");
// const session = require("express-session");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;


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

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "811398230314-kg8kfbcn5hd4moj12oq1rtqv91afejus.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: `http://localhost:8000/login/callback`,
//     },
//     async (accesstoken, refreshtoken, profile, done) => {
//       //   const user = await User.findOne({ googleId: profile.id });
//       return done(null, profile);
//     }
//   )
// );

// // serialize user into a session
// passport.serializeUser(function (token, done) {
//   done(null, token);
// });

// // deserialize user from a session
// passport.deserializeUser(function (token, done) {
//   done(null, token);
// });

// // authenticate user with Google
// router.get(
//   "/",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // handle Google OAuth 2.0 callback
// router.get(
//   "/callback",
//   passport.authenticate("google", { failureMessage: "failedAuth" }),
//   function (req, res) {
//     // Successful authentication, redirect to home page.
//     if (req.user) {
//       const token = req.user;

//       //   res.redirect(`${process.env.CLIENT_URL}redir/${token}`);
//       //   console.log("req.user", token);
//       res
//         .status(200)
//         .send(jsonData(true, "Sign Successful With google", token));
//     } else {
//       res.status(200).send(jsonData(false, "google Sign problem"));
//     }
//   }
// );

// module.exports=router
