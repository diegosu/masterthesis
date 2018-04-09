var mqtt = require('mqtt'); //include mqtt library
var mongodb = require('mongodb'); //include the mongodb library

//libraries necessary to decrypt msg from broker
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'abcde';

var utf8 = require('utf8');

var mongodbClient = mongodb.MongoClient; //initializes mongoDB client
var mongodbURI = 'mongodb://localhost:27017/mqtt';
var topic = '#'; //this is to subscribe to the wildcard topic
//means that the database will store data from all topics


mongodbClient.connect(mongodbURI, setupCollection); //connect the database

function setupCollection(err,db){
	if(err) throw err;
	const myDB = db.db('mqtt'); //need to set db name in a const
	collection = myDB.collection('mqttTesting'); //name of the collection in the db
	client = mqtt.connect(connectOptions);

	//ip where the mqtt broker is
	client.subscribe(topic); //subscribing to the topic name
	//client.publish('Hej', 'Hej hej'); //trying to publish
	client.on('message', insertEvent); //inserting the event

}

var connectOptions ={
		  host:'ZyaxMQTT',
		  port:1883,
		  protocol: 'mqtt',
		  //rejectUnauthorized: false, 
		  //could connect with this set to false
		  //ca: cert,
};


//function to decrypt the message received from the broker
function decrypt(text){

	var decipher = crypto.createDecipher(algorithm, password)
	var dec = decipher.update(text,'hex', 'utf8')
	dec += decipher.final('utf8');
	console.log(dec)
	return dec;

}

//function that insert the message received from the broker to 
//the DB

//Here I do receive the data I am subscribed to

function insertEvent(topic, message) {

	console.log('Decrypting message');

	//to decrypt the message

	var key=topic;
	//data is being stored in DB as BSON something
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
