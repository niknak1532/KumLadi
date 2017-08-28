var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/user-db') //NB - use: post-db
.then(() => console.log('Connection successful'))
.catch((err) => console.log(err));

var UserSchema = new mongoose.Schema({
   userID: {
	 type: String,
	 required:true
   },

   title: {
    type: String,
	 required:true
   }, 
 
   initials: {
    type: String,
	 required:false
   },

   name: {
     type: String,
	 required:true
   }, 
	
   surname: {
  	 type: String,
	 required:true
   }, 
  
   email: {
  	 type: String,
	 required:true
   },

   cell: {
     type: String,
	 required:true
   }, 

   modules: {
     type: [String],
	 required:true
   },

   pseodoname: {
     type: String,
	 required:true
   }
});
mongoose.model('User', UserSchema);
//static folder

var csStatusSchema = new mongoose.Schema ({
	userID: {
		type: String,
		required: true
	},
	
	courseCode: {
		type: String, 
		required: true
	}, 
	
	status: {
		type: String, 
		required: true
	}
});
mongoose.model('csStatus', csStatusSchema);

var Users = mongoose.model('User', UserSchema);
var csStatus = mongoose.model('csStatus', csStatusSchema);
var express = require('express');
var router = express.Router();
//~ var cors = require('cors');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ =require("lodash");


app.use(express.static(__dirname + '/public/dist')); // I am not to sure about this line

let bodyParser = require('body-parser');
//For adding middleware to application
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//~ app.use(cors());

//Morgan (logger)
let morgan = require('morgan');
app.use(morgan('dev'));
// **************** app.use(function(req,res,next){});

io.on('connection', function(socket) {
	console.log('User logged in');
	socket.on('disconnect', function() {
	 	console.log('User logged out');
	});
	 socket.on('save-message', function(data) {
	 	console.log(data);
	 	io.emit('New-message', {message:data});
	});
});

///////////////////////////////////////////Users///////////////////////////////////////////////////////////////

//display Users
app.get('/display', function(req, res, next) {
	console.log('/display get');
	Users.find(function(err, users) {
		//var docs=[];
		console.log("In display");
	 	console.log(users);
	 	if(err) {return next(err)};
		res.json(users);
	 });
});


//Create user
app.post('/createUser', function(req, res, next) {
	console.log('/createUser');
	var user = new Users(req.body);
	user.save(function(err, users) {
		console.log(users);
		if(err) return next(err);
		res.json(users).status(201);
	});
});

//Get user
app.get('/getUser/:userID', function(req, res, next) {
	console.log('/getUser/userID get');
	var user = req.params.userID;
	console.log('UserID = ' + user);
	Users.find({$or: [{'userID': user}, {'pseodoname': user}]}, function(err, doc) {
		if(err) {
			return next(err);
		}
		
		else if(!doc) {
			console.log('User not found');
			return res.json('User not found');
		}
		else {
			console.log(doc);
			return res.json(doc).status(200);
		}
	});
});

//Remove user
app.delete('/deleteUser', function(req, res, next) {
	console.log('/deleteUser');
	var user = req.body.userID;
	var pseo = req.body.pseodoname;
	Users.findOneAndRemove({$or: [{'userID': user}, {'pseodoname': pseo}]}, function(err, doc) {
	 	console.log('User deleted');
	 	console.log(doc);
	 	if(err) return next(err);
	 	res.json('User deleted');
	 });
});

///////////////////////////////////////////csStatus///////////////////////////////////////////////////////////////

app.post('/addModules', function(req, res, next) {
	console.log('/addModules');
	var cs = new csStatus(req.body);
	cs.save(function(err, csStat) {
		if(err) {
			return res.status(404).json('An error has occured');
		}
		
		else if(!csStat) {
			console.log('Document not found');
			return res.status(404).json('Document not found');
		}
		
		else {
			console.log(csStat);
			return res.status(200).json(csStat);
		}
	});
});

app.get('/getUserStatus/:userID', function(req, res, next) {
	console.log('/getUserStatus/:userID');
	var id = req.params.userID;
	
	csStatus.find({'userID': id}, function(err, doc) {
		if(err) {
			return res.status(404).json('An error has occured');
		}
		
		else if(!doc) {
			return res.status(404).json('User not found');
		}
		
		else {
			return res.status(200).json(doc);
		}
	});
});


app.patch('/updateStatus', function(req, res, next) {
	console.log('/updateStatus');
	
	csStatus.findOne({$and: [{userID: req.body.userID}, { courseCode: req.body.courseCode}]}, function(err, doc) {
		if(err) {
			return res.status(404).json('An error has occured');
		}
		
		else if(!doc) {
			return res.status(404).json('User not found');
		}
		
		else {
			console.log('Found');
			doc.status = req.body.status || doc.status;
		
			doc.save(function(err, doc) {
				if(err) {
					return res.status(404).json('An error has occoured');
				}
			
				else if(!doc) {
					return res.status(404).json('User not found');
				}
			
				else {
					console.log(doc);
					return res.status(200).json(doc);
				}
			});
		}
	});
});

app.listen(3010, ()=> console.log("Server running at 3010"));