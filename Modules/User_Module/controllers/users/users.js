var _       = require('lodash');
var debug   = require('debug')('kumladi-api:controllers:users');
var Users     = require('../../models/user');

debug('Initialising users controller');

debug('Exporting method: get');
module.exports.get = function(req, res, next){
	 debug('Trying to find users');
  	 Users.find(function(err, users){
     debug('Checking for errors');

     debug('Building JSON:API response');
     var data = [];
	
    _.forEach(users, function(user){
      	 var _data = {
        	 type: 'users',
        	 id: user.id,
        	 attributes: {
          		 surname: user.surname,
				 initials: user.initials,
				 student_number: user.student_number,
    			 email: user.email,
    			 user_level: user.user_level,
    			 modules: user.modules,
    			 subscribed_threads: user.subscribed_threads,
			 	 admin: user.admin
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
          		 detail:'The server has not found anything matching the Request-URI. i.e No locations were found'
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

debug('Exporting method: getBySN');
module.exports.getBySN = function(req, res, next){
debug('Extracting user student_number from params');
var sn = req.params.student_number;

  	 debug('Trying to find user with student_number: ' + sn);
	 Users.findOne({'student_number': sn}, function(err, user){
     	 debug('Checking for errors');
		 if(err) return  next(err);
		 if(!user) return next(new Error('User not found'));

    	 debug('Building JSON:API response');
    	 var response = {
       	     data: {
             	 type: 'users',
       			 id: user.id,
       			 attributes: {
           		 surname: user.surname,
	   			 initials: user.initials,
           		 student_number: user.student_number,
           		 email: user.email,
           		 user_level: user.user_level,
           		 modules: user.modules,
           		 subscribed_threads: user.subscribed_threads,
           		 admin: user.admin
        		}
     	   }  
    	};

     	 debug('Sending response (status: 200)');
     	 res.status(200).send(response);
    });
};
