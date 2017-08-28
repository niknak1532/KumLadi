var should		= require('should');
var needle		= require('needle');

describe('Update csStatus function: ', function() {
	 it('Should update user csStatus: ', function(done) {
	 	 var userData = {
			 "userID" : "A102",
			 "courseCode" : "cos132", 
			 "status" : "A"
	 	 };

	 	 needle.patch('localhost:3010/updateStatus', userData, function(err, res) {
	 	 	 if(err) {done(); return console.error(err.message);}

	 	 	 res.statusCode.should.equal(200)
			 console.log(res.body);
	 	 	 done();
	 	 });
	 });
});
