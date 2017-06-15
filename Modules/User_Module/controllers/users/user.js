var debug   = require('debug')('kumladi-api:controllers:user');
var Users     = require('../../models/user');

debug('Initialising location controller');

debug('Exporting method: create');
module.exports.create = function(req, res, next){
  //var user = req.user;

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

/*debug('Exporting method: Delete');
module.exports.delete = function(req, res) {
     var location = Loc.model('Loc', Loc);

     location.remove({room: req.body.room, building: req.body.building }, function(err) {
          if(!err){
               res.send(req.body.building + " " + req.body.room + " has been removed\n");
          }
          else {
               res.send("could not remove " + req.body.building + " " + req.body.room);
          }
     });
}

debug('Exporting method: Update');
module.exports.patch = function(req, res, next) {
     var location = Loc.model('Loc', Loc);

     location.findOneAndUpdate({room: req.body.room, building: req.body.building}, req.body, function(err, loc) {
          debug('Checking for errors');
          if(err) return next(err);
          if(!location) return next(new Error('could not find location'));

          loc.room = req.body.room || loc.room;
          loc.building = req.body.building || loc.building;
          loc.lat = req.body.lat || loc.lat;
          loc.lng = req.body.lng || loc.lng;
          loc.level = req.body.level || loc.level;
		  loc.ground = req.body.ground || loc.ground;

          loc.save(function(err, loc) {
               if(err) return next(err);
               if(!location) return next(new Error('Location returned empty.'));

               debug('Building JSON:API response');
               var response = {
                 data: {
                   type: 'locations',
                   id: loc.id,
                   attributes: {
                     room: loc.room,
                     building: loc.building,
                     lat: loc.lat,
                     lng: loc.lng,
                     level: loc.level,
					 ground: loc.ground
                   }
                 }
               };

               debug('Sending response (status: 200)');
               res.status(200).send(response);
          });
     });
}

debug('Exporting method: getById');
module.exports.getById = function(req, res, next){
  debug('Extracting location id from params');
  var id = req.params.id;

  debug('Trying to find location with id: ' + id);
  Loc.findOne({'_id': id.toString()}, function(err, location){
    debug('Checking for errors');

	if(err) return  next(err);
	

    debug('Building JSON:API response');
    var response = {
      data: {
        type: 'locations',
        id: location.id,
        attributes: {
          room: location.room,
          building: location.building,
          lat: location.lat,
          lng: location.lng,
          level: location.level,
		  ground: location.ground
        }
      }
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });
};*/
