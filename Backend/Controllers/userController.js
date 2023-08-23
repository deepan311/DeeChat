const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../DB/Models/UserModels");

exports.callback = async (req, res) => {
  const userData = req.user;
  // res.send(userData)
  try {
    const token = await jwt.sign(JSON.stringify(userData), process.env.KEY);

    if (!token) {
      return res.redirect(`${req.protocol}://${req.get("host")}/login`);
    }
    // ${req.get('host')}
    return res
      .status(200)
      .redirect(`${req.protocol}://${req.get('host')}/redirect/${token}`);
  } catch (error) {
    return res.status(400).redirect(`${req.protocol}://${req.get("host")}/login`);
  }
};

exports.fetchData = async (req, res) => {
try {
  const userData = req.data;
  if (!userData) {
    return res.status(400).send("user data illa parama");
  }
 
    const response = await User.findOne({ googleId: userData.googleId });
    if (!response) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).send(response);
 
} catch (error) {
  return res.status(500).send(error);
  
}
};
