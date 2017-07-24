const express = require('express'); // Require express
const handlebars = require('express-handlebars'); // Render engine
const bodyParser = require('body-parser'); //Require bodyparser to parse request body
const path = require('path'); // Static path
const sessions = require('client-sessions'); //sessuibs library
const app = express(); // Instantiate express


//Setting templating engine and folder for templates
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//MiddleWare to handle requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//SessionMiddleware setting up cookie
app.use(sessions({
	cookieName: 'session',
	secret: 'sdajkfhasjkdfhasikdhfkasjhdfkjasnbdf',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
}));

// Call all routes to handle with routes class
const router = require('./routes/router'); // Routes module
app.use('/', router);

//Listen to fucking port and server
app.listen(3000, function(res, res) { 
	console.log('Node is running on port 3000');
});