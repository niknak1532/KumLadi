var should		= require('should');
var needle		= require('needle');

describe('User create function: ', function() {
	 it('Should add new users: ', function(done) {
	 	 var userData = {
			 "userID" : "A101",
			 "title" : "Ms", 
			 "initials" : "HR",
			 "name" : "Her",
	 	 	 "surname" : "Ion", 
	 	 	 "email" : "herion@gmail.com", 
	 	 	 "cell" : "1234567800", 
	 	 	 "modules" : "216", 
			 "pseodoname" : "rion"
	 	 };

	 	 needle.post('localhost:3000/user/addUser', userData, function(err, res) {
	 	 	 if(err) {done(); return console.error(err.message);}

	 	 	 res.statusCode.should.equal(200)
	 	 	 res.body.should.have.property('data');
	 	 	 done();
	 	 });
	 });
});
