/* Server - Recieves message*/

var net = require('net');
var JsonSocket = require('json-socket');

var ldapjs = require('ldapjs');

var port = process.env.PORT || 9838;

console.log('Server running on port: ' + port);

var server = net.createServer();
server.listen(port);
server.on('connection', function(socket) { //This is a standard net.Socket
    socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket
    socket.on('message', function(message) {

        //CONNECT TO LDAP HERE
        var adminClient = ldapjs.createClient({
			url: 'ldap://192.168.0.100'
        });

        var studentNumber = message.userID;
        //var dn = "ou=Computer Science,o=University of Pretoria,c=ZA, uid=" + studentNumber;

        //adminClient.search()

        console.log('Building JSON-API response');
        var ldap = { //mock results from search
			pseodoname : "skips",
			userID : studentNumber,
			title : "Mr",
			initials : "KL",
			name : "Killer",
			surname : "LegDay",
			email : "legDay@gmail.com",
			cell : "021457897",
			modules : "COS227"
        };

        var result = JSON.stringify(ldap); //Send result from search as string

        console.log('Results sent: ' + result);
        socket.sendEndMessage({result:result});
    });
});