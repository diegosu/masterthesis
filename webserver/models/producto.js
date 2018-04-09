//here we write how our data from the database is like
var mongoose = require('mongoose');

	db = mongoose.createConnection('192.168.1.142', 'mqtt');
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    event: String

});



//UserSchema.plugin(passportLocalMongoose);

//module.exports = mongoose.model('User', UserSchema);
module.exports = UserSchema;
