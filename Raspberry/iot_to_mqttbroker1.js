var mqtt = require('mqtt'); //include mqtt library


var crypto = require('crypto');
var algorithm = 'aes-256-gcm';
//with this cipher I need a password and an iv
var pass= '3zTvzr3p67VC61jmV54rIYu1545x4TlY'


//TO MEASURE EXECUTION TIME OF THE PROGRAM
var start = new Date();

setTimeout(function (argument) {
    // execution time simulated with setTimeout function
    var end = new Date() - start;
    console.info("Execution time: %dms", end);
}, 1000);


var connectOptions = {
	host: 'mqttbroker1',  //name of mqttbroker1
	port: 1883,
	protocol: 'mqtt',
	
	//FOR NOW WE TRY WITHOUT USERNAME AND PASSWORD
	//username: 'diego',
	//password: 'mqttdiego',


};

var client = mqtt.connect(connectOptions);
//connect to the mqtt broker

var message ='Jag provar detta'; //same length of message for the results
var topic = 'nummerIV';
var topiciot = 'sensordata';

function encrypt(msg, iv){

	console.log('entra a encrypt'+ ' '+iv.toString('base64'))
	var cipher = crypto.createCipheriv(algorithm ,pass, iv )
//	var crypted = cipher.update(msg, 'utf8', 'hex')
//	crypted += cipher.final('hex')


	console.log('this is the cipher'+' '+cipher)

	const crypted = Buffer.concat([cipher.update(msg,'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	console.log(tag.length)
	console.log(crypted.length)
	const buflength = tag.length + crypted.length;
	
//	const buf = Buffer.concat([crypted, cipher.final('hex')])
	const cryptedfinal = Buffer.concat([tag, crypted], buflength)///////.toString('base64'); THIS BASE64 SEEMS TO BE ONE OF THE PROBLEMS
	console.log('this is the data sent'+crypted.toString('base64'))
	console.log('tag'+' '+tag)
	console.log('this is the tag' +' '+ tag.toString('base64'))
	sendData(cryptedfinal);
	
	return {
		
			content: crypted,
			tag: tag
		
	}
}

//var enc = encrypt(message); //we call the function
////client.publish(topic, message);

client.on('connect', function(){
	
	client.subscribe(topic);
	client.on('message', takeIV)

})




function takeIV(topic, iv){
	
	console.log('Taking IV'+ iv);
	client.unsubscribe(topic);
	encrypt(message, iv);

	
}


function sendData(message){
	
	//message is in base64
	client.publish(topiciot, message);
	console.log('this is the message published'+ message);
	client.end();
	
}


