var onErr = function(err,callback){

  mongoose.connection.close();
  callback(err);
};


exports.sensorlist = function(sensordata, callback){


//here we write how our data from the database is like
	var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
	//db = mongoose.createConnection('192.168.1.142', 'mqtt');
	mongoose.connect('mongodb://192.168.1.142:27017/mqtt');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	console.log("Entra en database.js antes de la funcion")
 //  db.once('open', function(){

   ///// var Schema = mongoose.Schema;
	//a function to take data from the database
    db.once('open', function(){
    	var UserSchema = new mongoose.Schema({
//    		_id: String,
		nombre: String,
		apellido: String

    	});


    var Sens = db.model('Sens', UserSchema, 'webserver') 
   console.log(sensordata);
   Sens.find({}, function (err,data) {
     if(err){
      //we throw the error so we call a function
      onErr(err,callback);
     }else{
      mongoose.connection.close();
      console.log(data) //no data
      callback("",data);
     }
    })

	module.exports = UserSchema;
    })

}
