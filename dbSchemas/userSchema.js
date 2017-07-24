const mongoose = require('mongoose'); // Mongoose to hande mongodb

//MongoDb schema
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
	id: ObjectId,
	firstName: String,
	lastName: String,
	email: { type: String, unique: true },
	password: String
}));

module.exports = User;
