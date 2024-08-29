const User = require("../models/users");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const generateUrlOtp = (password) => {
  let otpRaw = bcrypt.hashSync(password, 13);
  let otpRaw2;
  let otpRaw3;
  let otp;

  if (otpRaw.includes("/")) otpRaw2 = otpRaw.replaceAll("/", "");
  else otpRaw2 = otpRaw;
  if (otpRaw2.includes("\\")) otp = otpRaw2.replaceAll("\\", "");
  else otpRaw3 = otpRaw2;
  if (otpRaw3.includes("$")) otp = otpRaw3.replaceAll("$", "");
  else otp = otpRaw3;
  return otp;
};

const register = async (req, res, next) => {
  var {
    name,
    email,
    password,
    gender,
    occupation,
    phone,
    designation,
    birthDate,
  } = req.body;
  // console.log("user being created:",req.body);
  try {
    User.findOne({ email: email })
      .then((user) => {
        return res.status(409).send({ message: "Email already exists", user });
      })
      .catch((err) => res.send({ err }));
    // console.log("user being created:",err,data);

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be strong" });
    }

    //let otp = generateUrlOtp(password);
    let pw = bcrypt.hashSync(password, 8);

    await User.create({
      name: name,
      email: email,
      password: pw,
      details: { gender, occupation, phone, designation, birthDate },
    })
      .then((user) => {
        res.send({ user, message: "User Created successfully" });
      })
      .catch((err) => res.send({ err }));
  } catch (err) {
    //res.status(401).send({ message : err, error: err})
  }
};

const getUser = (req, res, next) => {
  User.findOne({ email: email })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => res.send({ err, message: "User not found" }));
};

const signin = async (req, res, next) => {
  var { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {

      if (!user)
        return res
          .status(404)
          .json({ message: `User not found with email '${email}'` });
      var pwIsValid = bcrypt.compareSync(password, user.password);
      if (!pwIsValid)
        return res
          .status(401)
          .send({ message: "Invalid password", token: null });
      var token = jwt.sign({ email }, process.env.API_SECRET, {
        expiresIn: process.env.JWTEXP,
      });
      //let orderId = bcrypt.hashSync(password, 3);
      //setTimeout(() => {
      ///if (user) {

      // console.log("user1--------", userCopy)
      // console.log("user--------", userCopy?.isOwner)
      // console.log("user--------", userCopy?.name, userCopy?.isOwner, userCopy?._id, userCopy?.email)
      // console.log("user2--------", userCopy)
      // console.log("user--------", typeof user?.isOwner === 'string' && user?.isOwner === 'true' ? 'true' : 'false');
      let userObj = {
        user: {
          admin: user?.admin,
          id: user?._id,
          name: user?.name,
          email: user?.email
        },
        message: "Login susscessful",
        token: token,
      }
      res.status(200).json({ ...userObj });

      //}
      //}, 400);
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ err, message: "User Not found" ?? err.message });
    });
};

module.exports = { register, signin };
