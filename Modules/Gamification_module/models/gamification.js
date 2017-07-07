var debug       = require('debug')('kumLadi-api:models:gamification');
var mongoose    = require('mongoose');

debug('Initialising model: Gamify');

debug('Defining schema: Gamify');

var Gamify_module = new mongoose.Schema({
  student_number: {
  		 type: String
  },
  
  user_level: { /*Status -- reputation*/
  		 type: String
  },

  number_message_posted: {
       type: Number
  }, 

  number_comments: {
       type: Number
  },

  number_up_Votes: {
       type: Number
  }, 

  number_down_Votes: {
       type: Number
  }, 

  points: {
       type: Number
  }, 

  total_bounty: {
       type: Number
  } 
});


debug('Users model exported');
module.exports = mongoose.model('Gamify', Gamify_module);
