const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');
const passport = require('passport');

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ 
 extended: false
}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//connect to MongoDB
mongoose.connect(db, {
 useNewUrlParser: true
}).then(() => console.log('MongoDB is Connected')).catch(err => console.log(err));

// app.get('/', (req, res) => {
//  res.send('Hello World');
// });

// Passport Middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);


// user routes
app.use('/api/users', users);
app.use('/api/profiles', profiles)
app.use('/api/posts', posts);

// app.post('/', (req, res) => {
//  res.send('Go to POST Request');
// })
// app.put('/user', (req, res) => {
//  res.send('Go to PUT Request at /user');
// })
// app.delete('/user', (req, res) => {
//  res.send('Go to DELETE Request at /user');
// })
const port = process.env.PORT || 5000;
app.listen(port, (req, res) => {
 console.log(`App is listening at ${port}!`);
})