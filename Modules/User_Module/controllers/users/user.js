var debug   = require('debug')('kumladi-api:controllers:user');
var Users     = require('../../models/user');

/*File for CRUD operations*/

debug('Initialising location controller');

debug('Exporting method: create');
module.exports.create = function(req, res, next){

  var user = new Users({
    	 surname: req.body.surname,
	     initials: req.body.initials,
	     student_number: req.body.student_number,
    	 email: req.body.email,
    	 user_level: req.body.user_level,
    	 modules: req.body.modules,
    	 subscribed_threads: req.body.subscribed_threads,
	     admin: req.body.admin
  });

   user.save(function(err, user){
     debug('Checking for errors');
     if(err) return next(err);
     if(!user) return next(new Error('User returned empty.'));

     debug('Building JSON:API response');
     var response = {
       data: {
       type: 'User',
       id: user.id,
       attributes: {
           surname: user.surname,
	         initials: req.body.initials,
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

