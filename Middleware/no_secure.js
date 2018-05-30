var mqtt = require('mqtt'); //include mqtt library
var mongodb = require('mongodb'); //include the mongodb library

//libraries necessary to decrypt msg from broker
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
////var password = 'abcde';

var utf8 = require('utf8');

//FOR THE MONGODB
var mongodbClient = mongodb.MongoClient; //initializes mongoDB client
var mongodbURI = 'mongodb://localhost:27017/mqtt';
var topic = '#'; //this is to subscribe to the wildcard topic
//means that the database will store data from all topics
var topiciv ='nummerIV';
var cert = fs.readFileSync('./ca-ecc.cert.pem');


mongodbClient.connect(mongodbURI, setupCollection); //connect the database

function setupCollection(err,db){
	if(err) throw err;
	const myDB = db.db('mqtt'); //need to set db name in a const
	collection = myDB.collection('mqttTesting'); //name of the collection in the db
	
	//CONNECTION TO THE FIRST MQTT BROKER 1 TO RECEIVE IV
	client = mqtt.connect(connectOptions);
	client.subscribe(topiciv);
	client.on('message', takeIV);
	//client.end();
	
	//CONNECTION TO THE MQTT BROKER2 VIA MQTTS
	client2 = mqtt.connect(optionsSecure);
	client2.subscribe(topic); //subscribing to the topic name
	//client.publish('Hej', 'Hej hej'); //trying to publish
	client2.on('message', insertEvent(iv)); //inserting the event

}


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


//function to decrypt the message received from the broker
function decrypt(text,password){

	var decipher = crypto.createDecipher(algorithm, password)
	var dec = decipher.update(text,'hex', 'utf8')
	dec += decipher.final('utf8');
	console.log(dec)
	return dec;

}

//function that insert the message received from the broker to 
//the DB

//Here I do receive the data I am subscribed to

function takeIV(topic, message) {
	
	console.log('taking IV');
	iv = message;
	return iv;
	
	
}



function insertEvent(iv,topic, message) {

	console.log('Decrypting message');

	//to decrypt the message

	var key=topic;
	//data is being stored in DB as BSON something
	var mes = decrypt(message, iv);
	var buff = message.toString('ascii'); //we parse the data
	//var buf = utf8.decode(decMsg)
	console.log(buff) //print before msg is decoded
	var buf = decrypt(buff)
	console.log(buf)

	collection.update(
		{ _id:key },
		{ $push: { events: {event: {value:buf
		//to store data in ascii format
		, when:new Date() } }}},
		{ upsert: true},

		function(err,docs) {
			if(err){
			console.log("Insert fail") //improve error handling
			}


		}


	);



}
