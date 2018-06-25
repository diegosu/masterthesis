var mqtt = require('mqtt'); //include mqtt library
var tls = require('tls'); //include tls module
var fs = require('fs'); //read files

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'abcde';

//CA list to determine if server is authorized
/////ECC
///////////var cert = fs.readFileSync('./ca.cert.pem');
/////RSA
var cert = fs.readFileSync('../carsa.cert.pem');
//depending ECC or RSA (ca.cert.pem)


///////////// TO MEASURE EXECUTION TIME OF THE PROGRAM///////////////////
var start = new Date();

setTimeout(function (argument) {
    // execution time simulated with setTimeout function
    var end = new Date() - start;
    console.info("Execution time: %dms", end);
}, 1000);



//var broker = 'tls://192.168.1.206:8883';
var connectOptions = {
	host: 'ZyaxMQTT',
	port: 8883,
	protocol: 'mqtts',
	rejectUnauthorized : true,
	ca: cert,
	username: 'diego',
	password: 'mqttdiego',

};

var client = mqtt.connect(connectOptions);
//connect to the mqtt broker
var message = crypto.randomBytes(5);
var iv_first = crypto.randomBytes(8);
var counter = new Buffer([0,0,0,0,0,0,0,0]);
var password = 'abcdeQWDSLocMAlpabcdeQWDSLocMAlp'; //Key cannot be 16 bytes
//return	format = require(message,'dec');
var topic = 'sensor data';

function encrypt(msg){

	// var cipher = crypto.createCipher(algorithm ,password)
	// var crypted = cipher.update(msg, 'utf8', 'hex')
	// crypted += cipher.final('hex')
	// return crypted;

	
	/////////////////NEW 13 JUNI
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

// var enc = encrypt(message); //we call the function

// client.on('connect', function(){

	// client.publish(topic, message, qos=1);
	// client.end();
///	now the client disconnects when data are sent
// })


var enc = encrypt(message); //we call the function


function publish(){
	
	client.publish(topic, enc, qos=1);
	//client.end();
	
}

client.on('connect', function(){


	setInterval(publish, 50000);

	//var end = new Date() - start;
    //console.info("Execution time: %dms", end);
})
