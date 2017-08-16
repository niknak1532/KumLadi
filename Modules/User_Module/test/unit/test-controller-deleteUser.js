var should		= require('should');
var needle		= require('needle');

describe('User Delete function: ', function() {
	it('Should remove specified users: ', function(done) {
	 	 var userData = {
	 	 	 "userID" : "A101", 
	 	 	 "pseodoname" : "rion"
	 	 };

	 	 needle.delete('localhost:3000/user/deleteUser', userData, function(err, res) {
	 	 	 if(err) {
	 	 	 	 done(); return console.error(err.message);
	 	 	 }

	 	 	 res.statusCode.should.equal(200)
	 	 	 //res.body.should.have.property('data');

	 	 	 done();
	 	 });
	 });
});