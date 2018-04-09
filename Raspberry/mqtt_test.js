var mqtt = require('mqtt'); //include mqtt library
var tls = require('tls'); //include tls module
var fs = require('fs'); //read files

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'abcde';

//CA list to determine if server is authorized
var cert = fs.readFileSync('./ca-ecc.cert.pem');
//depending ECC or RSA (ca.cert.pem)


//var broker = 'tls://192.168.1.206:8883';
var connectOptions = {
	host: 'ZyaxMQTT',
	port: 8883,
	protocol: 'mqtts',
	rejectUnauthorized : true,
	ca: cert,

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

var enc = encrypt(message); //we call the function

client.on('connect', function(){

	client.publish(topic, enc, qos=1);
	client.end();
	//now the client disconnects when data are sent
})
