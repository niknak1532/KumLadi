var debug       = require('debug')('kumLadi-api:models:post');
var mongoose    = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise=require('bluebird');
debug('Initialising model: post');

debug('Defining schema: post');

var Post_module = new Schema({
   heading: {
     type: String
   }, 

   level_number: { 
     type: Number  
   }, 

   child_list: {
   	 type: [mongoose.Schema.Types.ObjectId]
   }, 

   tag_list: {
     type: [String]
   }, 

   parent_ID: { 
     type: mongoose.Schema.Types.Mixed,
	   ref:'Post_module'
   }, 
// have a default preference
   content: {
   	 type: String
   }, 

   course_code: {
     type: String
   }, 

   student_number: {
     type: String
   }, 

   timestamp : {
     type: Date
   }
});


debug('post_module model exported');
module.exports = mongoose.model('postModule', Post_module);
