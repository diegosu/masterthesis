# masterthesis

This is an IoT project in which communication with MQTT over TLS is evaluated with different configurations. The main components are the IoT device, MQTT broker, a MongoDB and a webserver.

IoT device ---->
The device acting as the IoT device in this project is a Raspberry Zero and the code is in the Raspberry folder. 

MQTT broker 1 ---->

Middleware ----- >
Publish IV to which the database and the IoT device are subscribers. The middleware is subscribed to the sensordata topic to gather data from the IoT device.

MQTT broker 2 ---->
The code is in the MQTTbroker folder.

MongoDB ---->
The code is in the MongoDB folder.

Webserver ----> It is still being developed.
