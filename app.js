var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db'); // Fix import (remove { })
const dotenv = require('dotenv');
var cors = require('cors');

var app = express();

dotenv.config();
connectDB(); // ✅ CALL THE FUNCTION

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true // Allow cookies & headers if needed
}));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error'); // Make sure `views/error.ejs` exists if using EJS
});

module.exports = app;
