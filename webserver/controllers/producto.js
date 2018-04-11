//here we write functions 
var template = require('../views/template1');
var mongo_data = require('../models/database');

//in this function we get the data from the database and
//build it into the template

exports.get = function (req, res) {
	console.log("Entra en la funcion de producto.js")
	//res.send('Hej, Webserver heter jag!')
//	res.render('index', {
//	  title: 'Results obtained from the Blasting sensor',
  //        pagetitle: 'ZYAX RESULTS IoT',
//	});
	var nombre = 'diego';
        mongo_data.sensorlist(nombre, function(err,sensorlist){
	console.log("Entra" + sensorlist);
	 if(!err){
	   var strData = "", i=0, dataCount = sensorlist.length;
	   console.log("Ha vuelto de database" + dataCount)
	   for (i =0; i<dataCount;) {
	    strData = strData + "<li>" + sensorlist[i].nombre + " " + sensorlist[i].apellido + "</li>" ;
	    i = i+1
	   }

           strData = "<ul>" + strData +"</ul>"
	   res.writeHead(200, {'Content-Type': 'text/html'});
           res.write(
		template.build("ZYAX RESULTS IoT", "Results obtained from the Blasting sensor","<p>The data obtained is :</p>" + strData));
           res.end();
	 }
	 else{
	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write(
              template.build("oh no", "Database error", "<p>Error details: " +err+ "</p>"));
          res.end();
         }

});;
};


