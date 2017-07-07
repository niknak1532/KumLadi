var debug   = require('debug')('kumladi-api:controllers:gamify');
var Gamifys     = require('../../models/gamification');

debug('Initialising gamification controller');

debug('Exporting method: create');
module.exports.create = function(req, res, next){

  var gamify = new Gamifys({
	student_number: req.body.student_number, 
	user_level: req.body.user_level, 
	number_message_posted: req.body.number_message_posted, 
	number_comments: req.body.number_comments, 
	number_up_Votes: req.body.number_up_Votes, 
	number_down_Votes: req.body.number_down_Votes, 
	points: req.body.points, 
	total_bounty: req.body.total_bounty
  });

   gamify.save(function(err, gamify){
     debug('Checking for errors');
     if(err) return next(err);
     if(!gamify) return next(new Error('gamification returned empty.'));

     debug('Building JSON:API response');
     var response = {
       data: {
       type: 'Gamify',
       id: gamify.id,
       attributes: {
      	     student_number: gamify.student_number, 
			 user_level: gamify.user_level,
			 number_message_posted: gamify.number_message_posted, 
			 number_comments: gamify.number_comments, 
			 number_up_Votes: gamify.number_up_Votes, 
			 number_down_Votes: gamify.number_down_Votes, 
			 points: gamify.points, 
			 total_bounty: gamify.total_bounty
       }
      }
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });
};

