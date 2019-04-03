const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Create a User Schema
const UserSchema = new Schema({
 name: {
  type: string,
  required: true
 },
 email: {
  type: string,
  required: true
 },
 password: {
  type: string,
  required: true
 },
 avatar: {
  type: string,
  required: true
 },
 date: {
  type: Date,
  required: Date.now
 }
})