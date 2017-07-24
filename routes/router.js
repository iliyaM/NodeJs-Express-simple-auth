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

//Registration get method routing
router.get('/register', function(req, res) {
	res.render('register');
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

//Redirect to dashbopard page 
router.get('/dashboard', function(req, res) {
	res.render('dashboard.handlebars'); 
});


module.exports = router;