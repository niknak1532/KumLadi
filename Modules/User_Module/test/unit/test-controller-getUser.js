var should = require('should');
var needle		= require('needle'); 

describe('getUser by userID or pseodoname: ', function() {
	 it('Should return user information: ', function(done) {
	 	 var user = "1234";

	 	 needle.get('localhost:3000/user/getUser/'+user, function(err, res) {
	 	 	 if(err) {return console.error(err.message);}

	 	 	 res.statusCode.should.equal(200)
	 	 	 res.body.should.have.property('data');
	 	 	 done();
	 	 });
	 });
});