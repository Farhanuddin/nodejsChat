//requiring net module from Node's core.
//This Module is used for making Server and interact with TCP Stuff
var net = require('net');

//Create my TCP Server
var chatServer = net.createServer()
	clientList = []; 
//Hnadle Connection event on Server
//Develop your own understanding
//returns Client instance on conneciton
chatServer.on('connection', function(client){
	
	//Getting Client info
	client.name = client.remoteAddress + ':' + client.remotePort; 
	client.write('Hi! ' + client.name + '!\n');
	
	//Pushing All Client Connections to an Array
	clientList.push(client);

	//Listining on clients data event that will initiate whenever a client sends a message to
	//the server
	client.on('data', function(data){
		//console.log(data.toString());
		//Broadcasting the message of One Person to All Clients
		console.log("in boradcast");
		broadcast(data, client);

	});

	client.on('end', function(){
		console.log(client.name + ' quit');
		clientList.splice(clientList.indexOf(client), 1)
	});


	 client.on('error', function(e) {
		 console.log(e);
	 })

	//client.write('Bye\n');

	//client.end();


});


	function broadcast(message, client){
		var cleanup = [];

		for(var i=0; i<clientList.length; i+=1){
		  if(client !== clientList[i]){
		  
				if(clientList[i].writable) {
				 clientList[i].write(client.name + " says " + message)
				 } else {
				 cleanup.push(clientList[i])
				 clientList[i].destroy()
				 }
		  }	
		}

		 //Remove dead Nodes out of write loop to avoid trashing loop index
		 for(i=0;i<cleanup.length;i+=1) {
		 clientList.splice(clientList.indexOf(cleanup[i]), 1)
		 }

	}
	
//Listen to the Chat Server on Port on Port 9000
chatServer.listen(9000);

console.log("Chat Server listening on Port 9000");