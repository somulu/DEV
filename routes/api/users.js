const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load User Model (For checking user existance)
const User = require("../../Models/User");

//@route GET api/users/test
//@Description test users route
//@Access Public
router.get("/test", (req, res) =>
  res.json({
    message: "User Work"
  })
);

//@route GET api/users/register
//@Description Registration
//@Access Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      errorss.email = "Email already exist";
      return res.status(400).json({
        errorss
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Generation of Salt by Bcrypt for password hasing
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route GET api/users/login
//@Description User Login /Returing JWT Token
//@Access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json({ errors });
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({ msg: 'Success'});

        //user Matched
        const payload = {
          id: user.id, //JWT payload creation
          name: user.name,
          avatar: user.avatar
        };

        //Sign Token
        jwt.sign(
          payload,
          keys.secreatOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
            //console.log('token', token);
          }
        );
      } else {
        errors.password = "Incorrect password";
        res.status(400).json({ errors });
      }
    });
  });
});

//@route GET api/users/current
//@Description Return current user
//@Access Private

router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json(
      // req.user //Here can use {msg:'Success'}
      {
        name: req.user.name,
        id: req.user.id,
        email: req.user.email
      }
    );
  }
);

module.exports = router;
