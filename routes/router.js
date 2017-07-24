const express = require('express'); // Require express
const mongoose = require('mongoose'); // Mongoose to hande mongodb
const router = express.Router(); //Router object
const bcrypt = require('bcrypt'); //Encrypting
const app = express(); // Instantiate express


// Connect to mongo
mongoose.connect('mongodb://localhost/auth'); //Connect to mongo with db name
const User = require('../dbSchemas/userSchema');

//Home default route
router.get('/', function(req, res) {
	res.render('index');
});

//Registration get method routing
router.get('/register', function(req, res) {
	res.render('register');
});

//Registration get method routing
router.get('/login', function(req, res) {
	res.render('login');
});


// Registration PostMethod Strore to mongo
router.post('/register', function(req, res) {
	var salt = bcrypt.genSaltSync(10);
	
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, salt)
	});

	user.save(function(err) {
		if (err) {
			var err = "Something happend" + err;
			if (err.code === 11000) { //Mongo seraches for unique email if duplicate displayed 1100 error. 
				err = "The email you'v entred is allready exists.";
			} else {
				res.render('register', {error: err}); //Send back to tempalte view with attached err var.
			}
		} else {
			res.redirect('dashboard'); //Simple redirect catched by app.get below
		}
	})
});

//Post Login 
router.post('/login', function(req, res){
	User.findOne({email: req.body.email}, function(err, userObj) { //Send serach for one item in User model
		//return callback function withh err and object. if err null no match
		if (!userObj) {
			res.render('login', { error: 'Invalid email or password'});
		} else {
			//if password from post is equal to passdb
			if (bcrypt.compareSync(req.body.password, userObj.password)) { 
				//Setting up cookie session
				req.session.user = userObj; //set-cookie: session={email:'...', password:'...',}
				//simple redirect
				res.redirect('dashboard'); 
			} else {
				res.render('login', { error: 'password is not correct'}); //render login agan with message
			}
		}
	});
});

//Redirect to dashbopard page 
router.get('/dashboard', function(req, res) {
	if (req.session && req.session.user) { //Check if session exists
		// lookup the user in the DB by pulling their email from the session
		User.findOne({email: req.session.user.email}, function(err, user) {
			if (!user) {
				req.session.reset(); // destroy session
				res.redirect('login');
			} else {
				res.locals.user = user; //setting up local var to user object to use in tempaltes
				res.render('dashboard');
			}
		});
	} else {
		res.render('login'); 
	}
});



// //Redirect and handle logout
// router.get('/logout', function(req, res) {
// 	req.session.reset();
// 	res.render('index');
// });

	

module.exports = router;