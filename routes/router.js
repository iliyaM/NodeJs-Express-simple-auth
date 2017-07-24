const express = require('express'); // Require express
const mongoose = require('mongoose'); // Mongoose to hande mongodb
const router = express.Router(); //Router object
const app = express(); // Instantiate express



// Connect to mongo
mongoose.connect('mongodb://localhost/auth'); //Connect to mongo with db name
const User = require('../dbSchemas/userSchema');


//Home default route
router.get('/', function(req, res) {
	res.render('index');
});

//Redirect to dashbopard page 
router.get('/dashboard', function(req, res) {
	res.render('dashboard'); 
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
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password
	});

	user.save(function(err) {
		if (err) {
			var err = "Something happend" + err;
			if (err.code === 11000) { //Mongo seraches for unique email if duplicate displayed 1100 error. 
				err = "The email you'v entred is allready exists.";
			} else {
				res.render('register.handlebars', {error: err}); //Send back to tempalte view with attached err var.
			}
		} else {
			res.redirect('/dashboard'); //Simple redirect catched by app.get below
		}
	})
});

//Post Login 
router.post('/login', function(req, res){
	User.findOne({email: req.body.email}, function(err, obj) { //Send serach for one item in User model
		//return callback function withh err and object. if err null no match
		if (!obj) {
			res.render('login', { error: 'Invalid email or password'});
		} else {
			if (req.body.password === obj.password) {
				// res.render('login', { success: 'Success you are beeing redirecrted'});
				res.redirect('dashboard');
			} else {
				res.render('login', { error: 'password is not correct'});
			}
		}
	});
});
	

module.exports = router;