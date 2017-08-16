var should		= require('should');
var needle		= require('needle');

describe('User display function: ', function() {
	 it('Should display users: ', function(done) {
	 	 needle.get('localhost:3000/user/display', function(err, res) {
	 	 	 if(err) {done(); return console.error(err.message);}

	 	 	 res.statusCode.should.equal(200)
	 	 	 res.body.should.have.property('data');

	 	 	 done();
	 	 });
	 });
});