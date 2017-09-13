var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vote-db') //NB - use: post-db
.then(() => console.log('Connection successful'))
.catch((err) => console.log(err));

var VoteSchema = new mongoose.Schema({
	postID: {
		type: String,
		required: true
	}, 
	
	upVotes: {
		type: [String]
	}, 
	
	downVotes: {
		type: [String]
	}
});

mongoose.model('votemodule', VoteSchema);

var Votes = mongoose.model('votemodule', VoteSchema);
var express = require('express');
var router = express.Router();
var app = express();
//var server = require('http').createServer(app);
var _ =require("lodash");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var morgan = require('morgan');
app.use(morgan('dev'));

app.post('/createVoteUp', function(req, res, next) {
	console.log('/createVoteUp');
	Votes.findOne({$and: [{postID: req.body.postID}, {upVotes: req.body.userID}]}, function(err, doc) {
		if(err) {
			return res.status(404).json('An error has occured');
		}
		
		else if(doc) {
			res.status(404).json('User already voted for this post');
		}
		
		else if(!doc){
			var votes = new Votes(req.body);
			votes.save(function(err, vote) {
				if(err) {
					return res.status(201).json('An error has occured');
				}
				
				else {
					console.log(vote);
					res.status(200).json(votes);
				}
			});
		}
	});
});

app.post('/createVoteDown', function(req, res, next) {
	console.log('/createVoteDown');
	Votes.findOne({$and: [{postID: req.body.postID}, {downVotes: req.body.userID}]}, function(err, doc) {
		if(err) {
			return res.status(404).json('An error has occured');
		}
		
		else if(doc) {
			res.status(404).json('User already voted for this post');
		}
		
		else if(!doc){
			var votes = new Votes(req.body);
			votes.save(function(err, vote) {
				if(err) {
					return res.status(201).json('An error has occured');
				}
				
				else {
					console.log(vote);
					res.status(200).json(votes);
				}
			});
		}
	});
});

app.listen(3020, ()=> console.log("Server running at 3020"));