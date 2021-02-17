require('dotenv').config();
const path = require('path');
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const ejs = require('ejs');
const session = require('express-session');
const flash_messages = require('connect-flash');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('morgan')('tiny'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  httpOnly: true
}));
// ------ setting up flahs messages -----
app.use(flash_messages());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');

  next();
});
app.use(cookieParser(process.env.ACCESS_COOKIE_SECRET));
app.use(express.static(path.resolve(__dirname + '/public')));

// ------- routes -----
app.use(require(path.resolve(__dirname, 'src', 'routes', 'RegisterRoute.js')));
app.use(require(path.resolve(__dirname, 'src', 'routes', 'LoginRoute.js')));
app.use(require(path.resolve(__dirname, 'src', 'routes', 'ResetPasswordRoute.js')));

app.listen(port, () => {
  console.log("Server started");
});