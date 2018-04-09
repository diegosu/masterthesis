var mqtt = require('mqtt'); //include mqtt library


var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'abcde';


var connectOptions = {
	host: 'ZyaxMQTT',
	port: 1883,
	protocol: 'mqtt',
	username: 'diego',
	password: 'mqttdiego',


};

var client = mqtt.connect(connectOptions);
//connect to the mqtt broker

var message = 'Jag provar detta';
var topic = '16MARS';

function encrypt(msg){

	var cipher = crypto.createCipher(algorithm ,password)
	var crypted = cipher.update(msg, 'utf8', 'hex')
	crypted += cipher.final('hex')
	return crypted;


}

//var enc = encrypt(message); //we call the function
////client.publish(topic, message);

client.on('connect', function(){

	client.publish(topic, message);
	client.end();
})
