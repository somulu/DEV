const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//POST Route for Testing
router.get('/test', (req, res) => res.json({
 message: 'Posts Work'
}));

//Load post model
const Post = require('../../Models/Post');


//Validate Posts
const validatePostInput = require('../../validation/post');

//:::::::::::::::::::::::::::::::::::::::::Create Post Route START::::::::::::::::::::::::::::::::::::::::::::::::::::::://

//@Route POST api/post
//@desc  Create post
//@Access Private

router.post('/', passport.authenticate('jwt', {
 session: false
}), (req, res) => {
 const {
  errors,
  isValid
 } = validatePostInput(req.body);

 //Check Validation
 if (!isValid) {
  //Is not valid then return an error with 400 status
  return res.status(400).json(errors);
 }

 const newPost = new Post({
  text: req.body.text,
  name: req.body.name,
  avatar: req.body.avatar,
  user: req.body.id
 })

 newPost.save().then(post => res.json(post))
});

//:::::::::::::::::::::::::::::::::::::::::Create Post Route END::::::::::::::::::::::::::::::::::::::::::::::::::::::://

module.exports = router;