// Dependencies
var createError = require('http-errors');
var express = require("express");
var method = require("method-override");
var body = require("body-parser");
var cookieParser = require('cookie-parser');
var expressHbs = require("express-handlebars");
var session = require('express-session');
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var request = require("request");
var passport = require('passport');
var path = require('path');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var dotenv = require('dotenv').config();


// Mongoose Models

var Note = require("./models/Note");
var Article = require("./models/Article");

// Connect Mongoose to db
var db = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

mongoose.connect(db, function (error) {
    // Log any errors connection with mongoose
    if (error) {
        console.log(error);
    }
    // or log a success message
    else {
        console.log("mongoose connection is successful");
    }
});


var app = express();

// app set-ups

app.use(logger("dev"));
app.use(express.static("public"));
app.use(body.urlencoded({extended: false}));
app.use(method("_method"));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');


module.exports = app;