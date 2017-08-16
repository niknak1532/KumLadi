var _       = require('lodash');
var debug   = require('debug')('kumladi-api:controllers:user');
var Users     = require('../../models/user');

debug('Initialising the user controller');

//Create
debug('Exporting method: create');
module.exports.addUser = function(req, res, next) {
	 debug('Creating new user');

	 var  user = new Users({
	 	 userID: req.body.userID, 
	 	 title: req.body.title, 
	 	 initials: req.body.initials, 
	 	 name: req.body.name,
	 	 surname: req.body.surname, 
	 	 email: req.body.email, 
	 	 cell: req.body.cell, 
	 	 modules: req.body.modules, 
	 	 pseodoname: req.body.pseodoname
	 });

	 user.save(function(err, user) {
	 	 debug('Checking for errors');
	 	 if(err) return next(err);
	 	 if(!user) return next(new Error('User returned empty'));

	 	 debug('Building JSON:API response');
	 	 var response = {
	 	 	 data: {
	 	 	 	 type: 'User', 
	 	 	 	 docID: user.id, 
	 	 	 	 attributes: {
	 	 	 	 	 userID: user.userID, 
	 	 	 	 	 title: user.title, 
	 	 	 	 	 initials: user.initials, 
	 	 	 	 	 name: user.name,	 	 	
	 	 	 	 	 surname: user.surname, 
	 	 	 	 	 email: user.email, 
	 	 	 	 	 celll: user.cell, 
					 pseodoname: user.pseodoname,
	 	 	 	 	 modules: user.modules
	 	 	 	 }
	 	 	 }
	 	 };

	 	 debug('Sending response (status: 200)');
	 	 res.status(200).send(response);
	 });
};

//Read
debug('Exporting method: display')
module.exports.display = function(req, res, next) {
	 debug('Trying to find users');
	 Users.find(function(err, users) {
	 	 debug('Building JSON:API response');
	 	 var data = [];

	 	 _.forEach(users, function(users){
	 	 	 var _data = {
	 	 	 	 type: 'User', 
	 	 	 	 docID: users.id, 
	 	 	 	 attributes: {
					 userID: users.userID,
					 title: users.title, 
					 initials: users.initials,
					 name: users.name, 
	 	 	 	 	 surname: users.surname,
	 	 	 	 	 email: users.email, 
	 	 	 	 	 cell: users.cell, 
	 	 	 	 	 modules: users.modules,
					 pseodoname: users.pseodoname
	 	 	 	 }
	 	 	 };

	 	 	 data.push(_data);
	 	 });

	 	 if(data[0] == null) {
	 	 	var response = {
	 	 		errors: [ 
	 	 			 {
	 	 			 	 status: 504, 
	 	 			 	 title: 'Not found', 
	 	 			 	 details: 'The server has not found anything matching the Request-URI.'
	 	 		}
	 	 		]
	 	 	};
	 	 }

	 	 else {
	 	 	 var response = {
	 	 	 	 data: data
	 	 	 };
	 	 }

	 	 debug('Sending response (status: 200)');
	 	 res.status(200).send(response);
	 });
};

//Get user by userID or pseudoname
debug('Exporting method getUser');
module.exports.getUser = function (req, res, next) {
	 debug('Extracting passed parameter');
	 var user = req.params.userID;

	 Users.findOne({$or: [{'userID': user}, {'pseodoname': user}]}, function(err, doc) {
	 	 if(err) {
	 	 	 return next(err);
	 	 }

	 	 else if(!doc) {
	 	 	 res.status(504).send('User request for ' + user + ' returned empty');
	 	 }

	 	 debug('building JSON:API response');
	 	 var response = {
	 	 	 data: {
	 	 	 	 type: 'User', 
	 	 	 	 attributes: {
	 	 	 	 	 userID: doc.userID,
					 title: doc.title, 
					 initials: doc.initials,
					 name: doc.name, 
	 	 	 	 	 surname: doc.surname,
	 	 	 	 	 email: doc.email, 
	 	 	 	 	 cell: doc.cell, 
	 	 	 	 	 modules: doc.modules,
					 pseodoname: doc.pseodoname
	 	 	 	 }
	 	 	 }
	 	 };

	 	 debug('Sending response (status: 200)');
	 	 res.status(200).send(response);
	 });
};

debug('Exporting method: deleteUser');
module.exports.deleteUser = function(req, res) {
	 debug('Extracting userID/pseodoname');
	 var userID = req.params.userID;
	 var pseodoname = req.body.pseodoname;
	 
	 debug('Finding user from database:');
	
	 Users.findOneAndRemove({$or: [{'userID': userID}, {'pseodoname': pseodoname}]}, function(err, votes) {
		 debug('Checking for errors');
		 if(votes && !err) {
			 res.status(200).send(userID + ' has been deleted');
			 //return true;
		 }
		 
		 else if(err) {
			  res.status(504).send('Error occured within the request');
		 }
		 
		 else if(!votes){
			 res.status(504).send('Requested user: "' + userID + '" not found');
		 }
	 });
};

//Add Edit user