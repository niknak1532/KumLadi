var debug       = require('debug')('kumLadi-api:models:user');
var mongoose    = require('mongoose');

debug('Initialising model: Users');

debug('Defining schema: Users');

var User_module = new mongoose.Schema({
   surname: {
  	 type: String
   },

   initials: {
  	 type: String
   }, 
  
   student_number: {
  	 type: String
   },

   email: {
     type: String
   }, 
  
   user_level: {
  	 type: String
   }, 

   modules: {
     type: [String]
   }, 

   subscribed_threads: {
  	 type: [String]
   }, 

   admin: {
  	 type: Boolean
   }
});


debug('Users model exported');
module.exports = mongoose.model('User', User_module);
