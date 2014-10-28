var express = require('express.io');
var path = require('path');

//creates our server
var app = express().http().io();
// configuring our environments
app.configure(function(){
  app.use(express.cookieParser());  // for handling cookies
  app.use(express.json());    //for handling post data
  app.use(express.urlencoded());    //for handling post data

  //remember that static file server we slave over?? Express does it in one line...
  app.use(express.static(path.join(__dirname, 'public'))); //for handling static contents
  app.use(express.session({secret: 'ALVAROISAWESOME'})); //for using sessions
  app.set('view engine', 'ejs');
});
//we're going to have /routes/index.js handle all of our routing
var route = require('./routes/index.js')(app);
app.listen(6789);
console.log('TACOS ARE HAPPENING AT 6789, FOLLOW THE DATA!')

