var debug       = require('debug')('kumLadi-api:models:user');
var mongoose    = require('mongoose');

debug('Initialising model: Users');

debug('Defining schema: Users');

var User_module = new mongoose.Schema({
   userID: {
	 type: String
   },

   title: {
    type: String
   }, 

   initials: {
    type: String
   },

   name: {
     type: String
   }, 
	
   surname: {
  	 type: String
   }, 
  
   email: {
  	 type: String
   },

   cell: {
     type: String
   }, 

   modules: {
     type: [String]
   },

   pseodoname: {
     type: String
   }
});


debug('Users model exported');
module.exports = mongoose.model('User', User_module);
