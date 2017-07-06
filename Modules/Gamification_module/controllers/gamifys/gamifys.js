var _       = require('lodash');
var debug   = require('debug')('kumladi-api:controllers:gamifys');
var Gamifys     = require('../../models/gamification');

debug('Initialising gamification controller');

debug('Exporting method: get');
module.exports.get = function(req, res, next){
	 debug('Trying to find gamification - user');
  	 Gamifys.find(function(err, gamifys){
     debug('Checking for errors');

     debug('Building JSON:API response');
     var data = [];
	
    _.forEach(gamifys, function(gamify){
      	 var _data = {
        	 type: 'gamification',
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
      	 };
     data.push(_data);  
     });

	 if(data[0] == null){
		 var response = {
      	 	 errors: [
        	 {
          		 status: 404, 
          		 title: 'Not Found',
          		 detail:'The server has not found anything matching the Request-URI. i.e No users were found'
        	 }
      	 	 ]
     	 };
	 }

	 else
	{
		 var response = {
		  	 data: data
		 };	
	 }
	
	 debug('Sending response (status: 200)');
	 res.status(200).send(response);
  	 });
};

/* TO DO
	1. Points function	
	2. number of votes function
	3. number of messages function
	4. number of comments function
	5. bounty function
*/

