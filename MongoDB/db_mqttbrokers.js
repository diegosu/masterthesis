var mqtt = require('mqtt'); //include mqtt library
var mongodb = require('mongodb'); //include the mongodb library
var fs = require('fs'); //to read files


//libraries necessary to decrypt msg from broker
var crypto = require('crypto');
var algorithm = 'aes-256-gcm';
////var password = 'abcde';
var pass= '3zTvzr3p67VC61jmV54rIYu1545x4TlY'
var utf8 = require('utf8');

//FOR THE MONGODB
var mongodbClient = mongodb.MongoClient; //initializes mongoDB client
var mongodbURI = 'mongodb://localhost:27017/mqtt';
var topic = 'sensordata'; //this is to subscribe to the data sensor publishes
//means that the database will store data from all topics
var topiciv ='nummerIV';
var cert = fs.readFileSync('./ca-ecc.cert.pem');

var iv='';




//so we have client and client2

var optionsSecure ={
		  host:'ZyaxMQTT',
		  port:8883,
		  protocol: 'mqtts',
		  //rejectUnauthorized: false, 
		  //could connect with this set to false
		  ca: cert,
};

var connectOptions ={
		  host:'mqttbroker1',
		  port:1883,
		  protocol: 'mqtt',

};

//HERE THERE SHOULD BE ALSO TWO DIFFERENT CONNECTIONS
//TO DIFFERENT MQTT BROKERS

var client = mqtt.connect(connectOptions);
//connect to the mqtt broker1 to publish IV

var client2 = mqtt.connect(optionsSecure);


mongodbClient.connect(mongodbURI, setupCollection); //connect the database

client2.on('connect', function(){
	
	client2.subscribe(topic);
	client2.on('message', insertEvent)

})




function setupCollection(err,db){
	if(err) throw err;
	const myDB = db.db('mqtt'); //need to set db name in a const
	collection = myDB.collection('webserver'); //name of the collection in the db
	
	//CONNECTION TO THE FIRST MQTT BROKER 1 TO RECEIVE IV
	/* client = mqtt.connect(connectOptions) */;
	client.subscribe(topiciv); //to receive the IV
	
/* 	//CONNECTION TO THE MQTT BROKER2 VIA MQTTS
	client2 = mqtt.connect(optionsSecure); */
	
/* 	client.on('message', function(){
		
		setInterval(takeIV, 5000);


	}) */
	
	client.on('message', takeIV)

}





//////NEW TRIAL MAY 23, 2018
function decrypt(text,iv){

try {
	console.log('enters to decrypt' + iv)
	const buffertext = new Buffer(text)
//	const buffertext = new Buffer(text)
	//convert data to buffers
	//before we set in (0,16) now we write 24
	const tag = buffertext.slice(0,16) //16 bytes is the size of the tag
	const content = buffertext.slice(16)

	//WE DO NOT CHANGE THE TAG
	
	console.log('this is the tag'+' '+tag)
	
/* 	const buff = iv.toString('ascii');
	console.log('this is ascii IV'+buff)
//	const ivhex = new Buffer(iv, 'base64') */

	//const ivbuff = new Buffer(iv, 'base64')
	const ivbuff = iv.toString('base64');
	console.log('this is iv in base64'+' '+ivbuff)
	
	const passb = new Buffer(pass, 'base64')
	console.log('this is password in base64'+' '+ passb)
	
	var decipher = crypto.createDecipheriv(algorithm, pass, iv) //ivbuff with random	
	decipher.setAuthTag(tag);
	
	console.log('this is the tag'+' '+tag.toString('base64'))
	
	
	console.log('this is the decipher'+' '+decipher.toString('base64'))
	
////////VIKTIGT	//here only the content part is deciphered
//	var dec = decipher.update(content,'binary', 'utf8')
//	dec += decipher.final('utf8');
	const decrypted = decipher.update(content, 'binary', 'utf8') + decipher.final('utf8');

//	var buftext = new Buffer(text);
	
//	var dec = decipher.update(content, 'hex', 'utf8')
//	dec += decipher.final('utf8');
	console.log('This is the decrypted'+ ' '+ decrypted)
	
/* 	var decipher = crypto.createDecipher(algorithm, password)
	var dec = decipher.update(text,'hex', 'utf8')
	dec += decipher.final('utf8');
	console.log(dec) */
}catch(e){
 
	console.log(e)
}

        // error
        return decrypted;

}



//function that insert the message received from the broker to 
//the DB

//Here I do receive the data I am subscribed to

function takeIV(topic, message) {

///	client2.subscribe(topic); //subscribing to the topic name
	console.log('taking IV');
	iv = message;
	//client.unsubscribe(topiciv) //try to unsubscribe
	console.log('this is iv '+ iv); //to test if the value comes here or not

///	client.end();

	
	return iv;
	
	
}




function insertEvent(topic, message) {

	console.log('Decrypting message with '+ iv);
	console.log(message+'AND'+topic)
	//to decrypt the message

	var key=topic;
	//data is being stored in DB as BSON something
	var mes = decrypt(message, iv);
	var buff = message.toString('ascii'); //we parse the data
	//var buf = utf8.decode(decMsg)
	console.log(buff) //print before msg is decoded
	//var buf = decrypt(buff)
	console.log(mes)

	if(mes!=null){
		
	//insert new data in the database
	var obj = {nombre: mes, apellido: key};
	collection.insert(obj, function (err,res){

	  if (err) throw err;
	  console.log("1 document inserted");

	})
		
	}


	client.subscribe(topiciv)
}




