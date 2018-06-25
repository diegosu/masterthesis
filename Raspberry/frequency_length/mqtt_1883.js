var mqtt = require('mqtt'); //include mqtt library


var crypto = require('crypto');
var algorithm = 'aes-256-ctr';



///////////// TO MEASURE EXECUTION TIME OF THE PROGRAM///////////////////
var start = new Date();

/* setTimeout(function (argument) {
    // execution time simulated with setTimeout function
    
}, 1000); */



var connectOptions = {
	host: 'mqttbroker1',
	port: 1883,
	protocol: 'mqtt',
//	username: 'diego',
//	password: 'mqttdiego',


};

var client = mqtt.connect(connectOptions);
//connect to the mqtt broker

var message = crypto.randomBytes(5000);
/////var message = 'holamellamoDiego'
var iv_first = crypto.randomBytes(8);
var counter = new Buffer([0,0,0,0,0,0,0,0]);
var password = 'abcdeQWDSLocMAlpabcdeQWDSLocMAlp'; //Key cannot be 16 bytes
//return	format = require(message,'dec');
var topic = 'sensor data';

function encrypt(msg){

	///////////////////////////////////////////var cipher = crypto.createCipher(algorithm ,password)
	
	//////NEW TO ADD NONCE
	const bufflength = iv_first.length + counter.length;
	console.log(bufflength)
	console.log('this is the counter'+' '+counter)
	const iv = Buffer.concat([iv_first, counter],bufflength);
	var cipher = crypto.createCipheriv(algorithm ,password, iv )
	console.log('iv lenght'+' '+iv.length)
	
	/////WITH THE BUFFER WORKS AND IT DOES NOT HAVE EXTRA ADDED BYTES
	
	const crypted = Buffer.concat([cipher.update(msg,'utf8'), cipher.final()]);
	///const tag = cipher.getAuthTag();
	//console.log(tag.length)
	console.log(crypted.length)
	//const buflength = tag.length + crypted.length;
	
	// var crypted = cipher.update(msg, 'utf8', 'hex')
	// crypted += cipher.final('hex')
	return crypted;


}



function publish(){
	
	var enc = encrypt(message); //we call the function
////client.publish(topic, message);
	client.publish(topic, enc, qos=1);
	client.end();
		/////////// TO MEASURE EXECUTION TIME OF THE PROGRAM///////////////////
	var end = new Date() - start;
	console.info("Execution time: %dms", end);
	
}


client.on('connect', function(){

	console.log('Entra a enviar mensaje')
	
	///////////////FRECUENCY OF MESSAGES/////////////////////////
	// client.on('connect', function(){
	// sendIV;
	// setInterval(sendIV, 500);
	
// })
	publish()
	//setInterval(publish, 5000);
	
	
	// client.end();
	/////////// TO MEASURE EXECUTION TIME OF THE PROGRAM///////////////////
	// var end = new Date() - start;
	// console.info("Execution time: %dms", end);
})


