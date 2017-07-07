var debug       = require('debug')('kumLadi-api:models:message');
var mongoose    = require('mongoose');

debug('Initialising model: Message');

debug('Defining schema: Message');

// 4th
var Comments = new mongoose.Schema({
     student_number: { //for people commenting
         type: String
     }, 

     comment: { //actual comment
         type: String 
     }

});

// 3rd
var Posts = new mongoose.Schema({
   student_number: { //for the creator of the post
       type: String
   }, 

   
   post_desc : { //actual message posted
       type: String
   }, 

   post_comments: [Comments], //collection of comments

   post_tags : {
       type: [String]
   },

   visibility: {
       type: Boolean
   }, 

   up_votes: {
       type: [String]
   }, 

   down_votes: {
       type: [String]
   }
});

// 2nd
var Thread = new mongoose.Schema({
    student_number: { //for the creator of the thread
       type: String
    }, 

    thread_name: {
        type: String
    }, 

    post: [Schema.Types.Objectid] /*Post array*/ 

    thread_tags: {
         type: [String]
    }, 

    participants: { /* *=all users*/
         type: [String]
    }
});

// 1st
var Message_module = new mongoose.Schema({
   module_Code: {
       type: String
   }, 

   thread_Name: [Schema.Types.Objectid] /*Thread -- Subject*/
});


debug('Message model exported');
module.exports = mongoose.model('Message', Message_module);
