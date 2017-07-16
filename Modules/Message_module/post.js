var debug       = require('debug')('kumLadi-api:models:post');
var mongoose    = require('mongoose');

debug('Initialising model: Post');

debug('Defining schema: Post');

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

debug('Post model exported');
module.exports = mongoose.model('Post', Post);