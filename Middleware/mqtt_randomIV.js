var mqtt = require('mqtt'); //include mqtt library
var fs = require('fs'); //include library to read files
var crypto = require('crypto');


//key for the MQTT broker 2
var cert = fs.readFileSync('./ca-ecc.cert.pem');



var message ='thisISdieIV3';
var topic = 'nummerIV';
var topiciot = 'sensordata'

var connectOptions = {
	host: 'mqttbroker1',
	port: 1883,
	protocol: 'mqtt'
//	username: 'diego',
//	password: 'mqttdiego',


};

var optionsSecure ={
		  host:'ZyaxMQTT',
		  port:8883,
		  protocol: 'mqtts',
		  //rejectUnauthorized: false, 
		  //could connect with this set to false
		  ca: cert,
};
//var enc = encrypt(message); //we call the function
////client.publish(topic, message);


//HERE THERE SHOULD BE ALSO TWO DIFFERENT CONNECTIONS
//TO DIFFERENT MQTT BROKERS

var client = mqtt.connect(connectOptions);
//connect to the mqtt broker1 to publish IV

var client2 = mqtt.connect(optionsSecure);


function encrypt(msg){

	var cipher = crypto.createCipher(algorithm ,password)
	var crypted = cipher.update(msg, 'utf8', 'hex')
	crypted += cipher.final('hex')
	return crypted;


}



function sendIV(){

	console.log('sending IV')

	//random bytes needed for IV
	message = crypto.randomBytes(12);
	console.log(message.toString('base64'))

	client.publish(topic, message, {qos:1, retain: true});

	
	
	//We want to retain the message in MQTT broker1 so when the IoT connects can still get the message
	console.log(message)
	//NOW IT SHOULD TAKE THE MESSAGE THE ACTUAL IoT DEVICE SENDS
	client.subscribe(topiciot);
	/////////client.unsubscribe(topicot);
	//client.end();
	
}


client.on('connect', function(){
	sendIV;
	setInterval(sendIV, 50000);
	
})

function takeMessage(topi, message){
	
	//we take the message from the IoT device
	console.log('taking message from IoT device');
	client2 = mqtt.connect(optionsSecure);
	console.log('this is what we send'+ message)
	//ENCRYPTION OF THE MESSAGE ??
	//we publish it to the MQTT broker 2
	console.log(topi)
	client2.publish(topi, message, {qos:1});
	
}


//WHEN MIDDLEWARE RECEIVES MESSAGE FROM IOT DEVICE
client.on('message', function(topiciot,mes){
	
	console.log('receiving message from IoT');
	takeMessage(topiciot, mes);
//	client.unsubscribe(topiciot);
//	client.end();
	
})


client2.on('published', function(){
	
	client2.end();
	
})
