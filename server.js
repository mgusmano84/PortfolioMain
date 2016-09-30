// Include Server Dependencies
var express = require('express');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
// var mongojs = require('mongojs');

// Create Instance of Express
var app = express();
var PORT = process.env.PORT || 3000; // Sets an initial port. We'll use this later in our listener

// makes static content in assets accessible
app.use(express.static(process.cwd() + '/assets'));

// Run Morgan for Logging
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


//setting up handlebars
var exphbs = require('express-handlebars');
var hbs = require('handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//require routes
require('./routing/html-routes.js')(app);



// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
