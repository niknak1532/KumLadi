var mongoose = require('mongoose'); 
//var console.log       = require('console.log')('kumLadi-api:controllers:post');

mongoose.Promise = global.Promise;
/*var connectionToPost=mongoose.createConnection('mongodb://KamoKG:buzzTestPost1234@ds119044.mlab.com:19044/post-db');
var connectionToUser=mongoose.createConnection('mongodb://nathi:2580456Nn@ds161483.mlab.com:61483/kumladi-users-db');
*/

var connectionToPost = mongoose.createConnection('mongodb://localhost/post-db')
var connectionToUser = mongoose.createConnection('mongodb://localhost/user-db');

console.log('Initialising model: post');
var Post_module = new mongoose.Schema({
   heading: {
     type: String
   }, 

   level_number: { 
     type: Number
   }, 
   
   bounty_assigned:{
	type:Number,
	default:0
   },
   
   child_list: {
   	 type: []
   }, 

   tag_list: {
     type: [String]
   }, 

   parent_ID: { 
     type: mongoose.Schema.Types.Mixed
   }, 
   
   content: {
   	 type: String
   }, 

   course_code: {
     type: String
   }, 

   student_number: {
     type: String
   }, 

   timestamp : {
     type: Date,
	 default: Date.now
   },
   visibility:{
	   type:Boolean,
	   default: true
   }
});
console.log('Initialising model: vote');
var VoteSchema=new mongoose.Schema({
	postID:{
		type:mongoose.Schema.Types.Mixed
	},
	upVotes:{
		type:[String]
	},
	downVotes:{
		type:[String]
	}
});
console.log('Initialising model: user');
var UserSchema = new mongoose.Schema({
   userID: {
	 type: String
   },

   title: {
    type: String
   }, 
 
   initials: {
    type: String
   },

   name: {
     type: String
   }, 
	
   surname: {
  	 type: String
   }, 
  
   email: {
  	 type: String
   },

   cell: {
     type: String
   }, 

   modules: {
     type: [String]
   },

   pseodoname: {
     type: String
   }
});
console.log('Initialising model: CS status');
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

var csStatus = connectionToPost.model('csStatus', csStatusSchema);
var csStatusS=csStatus;
var Users=connectionToUser.model('User', UserSchema);
var Votes=connectionToPost.model('votemodule',VoteSchema);
var Posts = connectionToPost.model('postModule', Post_module);
var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ =require("lodash");
var path = require('path');

var cors = require('cors');

/*Added*/

var net = require('net');
var JsonSocket = require('json-socket');
//Server B port number
var sBPort = process.env.PORT || 9838;

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname + '/public/dist'))); // I am not to sure about this line

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

/**
* @params req.params.course_code The course code.
* @params req.params.content The content to be added.
* @params req.params.heading The heading ofthe post.
* @params req.params.student_number The student number of the creator of the post.
* @params req.params.tag_list The array of the tag lists to be added.
* @todo A post will be created and saved on the database.
* @return A JSON object will be returned. If successful then the post's ID will be in the object.
*/
app.post('/createPost',function(req,res,next){
	var post=new Posts({
		heading:req.body.heading,
		level_number:0,
		child_list:[],
		parent_ID:null,
		course_code:req.body.course_code,
		timestamp: new Date(),
		student_number:req.body.student_number,
		content:req.body.content,
		tag_list:req.body.tag_list
	});
	// saving the new post
	post.save(function(err, obj){
		if(err)
		{
			console.log("Encountered an error: "+err);
			return res.status(200).send({
				"data":err,
				"status":false,
				"postID":null
			});
		}
		else if(!obj)
		{
			console.log("Failed to save the document. May be missing parameters");
			return res.status(200).json({
				"data":"Failed to save the document. May be missing parameters",
				"status":false,
				"postID":null
			});
		}
		else
		{ 
			 /*res.status(200).send({
				post_ID:obj._id,
				heading:obj.heading*/
			 console.log('Sending response (status: 200)');
			 return res.status(200).json({
				 "status":true,
				 "data":"Successfully added the post",
				 "postID":obj._id
			 });
		}	
	});
});
/**
* @params req.params.postID The ID of the post to be updated.
* @params req.body.tag_list The taglists to be added.
* @todo The post to be edited will be found using it's ID then the tag list will be updated.
* @return A JSON object will be returned. If successful then it will contain the post's ID, otherwise it an error message will be in the object.
*/
app.patch('/editPost',function(req,res,next){ 
	if(req.body.postID && req.body.content)
	{
		Posts.findById(req.body.postID,function(err,doc){
			if(err)
			{
				console.log("An error was encountered: ",err);
				res.status(200);
				return res.json({
					"text":err,
					"status":false,
					"postID":null,
					"content":null
				});
			}
			else if(!doc)
			{
				console.log("Failed to edit the post");
				res.status(200);
				return res.json({
					"status":false,
					"text":"Failed to edit the post",
					"postID":null,
					"content":null
				});
			}
			else
			{
				doc.content=req.body.content||doc.content;
				doc.save(function(err,doc){
					if(err)
					{
						console.log("Encountered error");
					}
				});
				res.status(200);
				return res.json({
					"status":true,
					"text":"Successfully edited the post",
					"postID":doc._id,
					"content":doc.content
				});
			}
		});
	}
	else
	{
		console.log("Parameters were missing");
		res.status(200);
		return res.json({
			"status":false,
			"postID":null,
			"content":null,
			"text":"Parameters were missing"
		});
	}
});

/**
* @params req.params.postID The ID of the post to be removed
* @todo The post will be found using it's ID and then removed.
* @return Nothing will be returned.
*/
app.delete('/removePost',function(req,res,next){
	if(req.body.postID) //Changed cause it recieves JSON obj with id
	{
		Posts.findById(req.body.postID,function(err,doc){
			if(err)
			{
				console.log("Encountered error: "+err);
				res.status(200);
				return res.json({
					"status":false,
					"data":"Encountered error on the server side"
				});
			}
			else if(!doc)
			{
				console.log("Could not find the document being searched for.");
				res.status(200);
				return res.json({
					"status":false,
					"data":"Could not find the document being searched for."
				});
			}
			else
			{
				console.log("Found the document");
				doc.visibility=false||doc.visibility;
				doc.save(function(err, post){
					if(err)
					{
						console.log("Encountered error: "+err);
						res.status(200);
						return res.json({
							"status":false,
							"data":"Failed to remove the document"
						});
					}
					else
					{
						_.forEach(post.child_list,function(npost){
							remove(npost);
						});
						if(doc.parent_ID!=null)
						{
							Posts.findById(doc.parent_ID,function(err,obj){
								if(err)
								{
									console.log(err);
									return res.status(200).json({
										"status":false,
										"data":err
									});
								}
								else
								{
									_.forEach(obj.child_list,function(obj){
										if(obj.postID==doc._id)
										{
											obj.visibility=false;
										}
									});
									obj.save(function(err,obj){
										if(err)
										{
											console.log(err);
											return res.status(200).json({
												"status":false,
												"data":err
											});
										}
										else
										{
											console.log("Succesfully removed post");
											return res.status(200).json({
												"status":true,
												"data":"Successfully removed post"
											});
										}
									});
								}
							})
						}
						else
						{
							console.log("Successfully removed post");
							return res.status(200).json({
								"status":true,
								"data":"Succesfully removed post"
							});
						}
					}
				});
			}
		});
	}
	else
	{
		return res.status(200).json({
			"status":false,
			"data":"Missing parameters"
		});
	}
});
var remove=function(obj){
	Posts.findById(obj.postID,function(err,post){
		if(err)
		{
			console.log(err);
			return;
		}
		post.visibility=false;
		post.save(function(post){
			_.forEach(post.child_list,function(post){
				remove(post);
			});
		});
	});
};
/**
* @params req.params.course_code The course code for the posts to be found.
* @todo All the level-0 posts will be sorted in ascending order then their IDs and heading will be returned.
* @return A JSON object will be returned. If successful then every index of the array will contain a JSON object.
*/ 
app.get('/getAllPosts/:course_code',function(req,res,next){
	if(req.params.course_code)
	{
		Posts.find({"level_number":0,"course_code":req.params.course_code},['heading','_id','level_number'],{skip:0,limit:10,sort:{"timestamp":-1}},function(err,doc){
			var docs=[];
			if(err)
			{
				console.log("Encountered error while retriving documents");
				res.status(200).json({
					"status":false,
					"data":[],
					"text":err
				});
			}
			else if(doc)
			{
				_.forEach(doc,function(u){
					docs.push({
						heading:u.heading,
						postID:u._id
					});
				});
				if(docs.length==null||docs.length==0)
				{
					console.log("No posts were found");
				}
				else
				{
					console.log("Found all the level-0 posts");
				}
				res.status(200).json({
					"data":docs,
					"status":true,
					"text":"Found documents"
				});
			}
			else 
			{
				res.status(200).json({
					"data":[],
					"status":false,
					"text":"could not find any documents"
				});
			}
		});
	}
	else
		res.status(200).json({
			"data":[],
			"status":false,
			"text":"missing parameters"
		});
});
/**
* @params req.params.parentID This will hold the ID of the parent post.
* @params req.body.student_number This will hold the student number of the student who he appending to the post.
* @params req.body.content This will be the content that will be attached to the post.
* @params req.body.tag_list This will be the array of chosen tags, which will be attached to the post.
* @todo The post will be created and then linked to the parent post.
* @return A JSON object will be returned. If the appending operation was successful then the JSON object will carry the new post's ID, otherwise an error message will be in the JSON object.
*/
app.post('/addPost/:parentID',function(req,res,next){
	if(!req.params.parentID)
	{
		console.log("No parameters found");
		res.status(200).json({
			"text":"No parameters found",
			"status":false,
			"postID":null,
			"heading":null
		});
	}
	Posts.findById(req.params.parentID,function(err,post){
		if(err)
		{
			console.log("An error was encoutered",err);
			res.status(200).json({
				"text":err,
				"status":true,
				"postID":null,
				"heading":null
			});
		}
		else if(!post)
		{
			console.log("Failed to find the post");
			res.status(200).json({
				"text":"Failed to find the post",
				"status":false,
				"postID":null,
				"heading":null
			});
		}
		else if(post)
		{
			var nLevel=parseInt(post.level_number) +1;
			var doc=new Posts({
				heading:req.body.heading,
				level_number:nLevel,
				child_list:[],
				parent_ID:post._id,
				course_code:post.course_code,
				timestamp: new Date(),
				student_number:req.body.student_number,
				content:req.body.content,
				tag_list:req.body.tag_list
				
			});
			console.log("Inserting at id "+post._id);
			doc.save(function(err,savedDoc){
				if(err)
				{
					console.log("There was an error saving the document",err);
					res.status(200).json({
						"text":err,
						"postID":null,
						"heading":null,
						"status":false
					});
				}
				if(!savedDoc)
				{
					console.log("Document failed to save");
					res.status(200).json({
						"status":false,
						"postID":null,
						"heading":null,
						"text":"Failed to save the document"
					});
				}
				else
				{
					console.log("Successfully saved document");
					Posts.findById(savedDoc.parent_ID,function(err,newDoc){
						if(err)
						{
							console.log("Encountered an error when trying to find and update the parent post",err);
							res.status(200).json({
								"status":false,
								"postID":null,
								"heading":null,
								"text":"Failed to find and update parent post"
							});
						}
						else if(!newDoc)
						{
							console.log("Failed to update the parent post");
							res.status(200).json({
								"status":false,
								"postID":null,
								"heading":null,
								"text":"Failed to update the parent post"
							});
						}
						else
						{
							//console.log("Child list: "+newDoc.child_list[0]);
							newDoc.child_list.push({
								postID:savedDoc._id,
								heading:savedDoc.heading,
								level:savedDoc.level_number,
								visibility:true
							});
							newDoc.save(function(err,obj){
								if(err)
								{
									console.log("Encountered error: "+err);
									res.status(200).json({
										"status":false,
										"postID":null,
										"heading":null,
										"text":err
									});
								}
								else
								{
									console.log("Successfully appended to parent");
									res.status(200).json({
										"status":true,
										"postID":obj._id,
										"heading":obj.heading,
										"text":"Successfully appended to parent"
									});
								}
							});
						}
					});
				}
			});
		}
	});
});
/**
* @params req.params.course_code The course code searched for
* @todo All posts will be sorted by the dates created and the most recent five posts will be picked.
* @return A JSON object will be returned. If documents were found then an array with them will be returned, otherwise there will be no array.
*/ 
app.get('/getRecentPosts/:course_code',function(req,res,next){
	console.log("Finding all documents");
	Posts.find({"visibility":true},['_id','heading'],{skip:0,limit:5,sort:{"timestamp":-1}},function(err,doc){
		var docs=[];
		if(err)
		{
			console.log("Encountered error");
			return res.status(200).json({
				"status":false,
				"data":[],
				"text":"Encountered error"
			});
		}
		else
		{
			_.forEach(doc,function(u){
				var pass={
					postID:u._id,
					heading:u.heading
				};
				docs.push(pass);
			});
		}
		if(docs.length==0)
		{
			console.log("Could not find any documents in the database");
			return res.status(200).json({
				"status":true,
				"data":[],
				"text":"Could not find any documents in the database"
			});
		}
		else
		{
			var result={
				"status":true,
				"data":docs,
				"text":"Could not find any documents in the database"
			};
			return res.status(200).json(result);
		}
	});
});
/**
* @params req.params.postID The ID of the post.
* @todo All the child posts of the post will be found and sorted in ascending order according to their timestamps. The documents' IDs and heading will be stored in an array.
* @return A JSON object will be returned. If successful then the object will contain an array of JSON objects, otherwise there will be an error message.
*/ 
app.get('/getChildPosts/:postID',function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,post){
			if(err)
			{
				console.log('Encountered error: '+err);
				return res.status(200).json({
					"status":false,
					"data":[],
					"text":err
				});
			}
			else if(post)
			{
				console.log('Children: '+post.child_list);
				var docs=[];
				_.forEach(post.child_list,function(post){
					if(post.visibility==true)
						docs.push(post);
				});
				return res.status(200).json({
					"status":true,
					"data":docs,
					"text":"found child posts"
				});
			}
			else
			{
				console.log('No post found');
				return res.status(200).json({
					"status":true,
					"data":[],
					"text":"found no child posts"
				});
			}
		});
	}
	else
	{
		console.log('No parameters received');
		return res.status(200).json({
			"status":false,
			"data":[],
			"text":"No parameters received"
		});
	}
});
/**
* @params req.params.course_code The course code for the posts to be found.
* @todo All the posts will be sorted in ascending order then their IDs and heading will be returned.
* @return A JSON object will be returned. If successful then every index of the array will contain a JSON object.
*/ 
app.get('/getPosts/:course_code',function(req,res,next){
	if(req.params.course_code)
	{
		Posts.find({"level_number":0,"course_code":req.params.course_code},['_id','heading','level_number'],{sort:{"timestamp":-1}},function(err,doc){
			var docs=[];
			if(doc)
			{
				_.forEach(doc,function(u){
					docs.push({
						postID:u._id,
						heading:u.heading
					});
					//console.log("Post: "+u._id);
				});
				
			}
			if(err)
			{
				console.log("Encountered error");
				return res.status(200).json({
					"status":false,
					"data":[],
					"text":err
				});
			}
			else if(docs.length==0)
			{
				console.log("No posts");
				return res.status(200).json({
					"status":true,
					"data":[],
					"text":"No posts"
				});
			}
			else
			{
				return res.status(200).json({
					"status":true,
					"data":docs,
					"text":"No posts"
				});
			}
		});
	}
	else
	{
		console.log("Parameters missing");
		return res.status(200).json({
			"status":false,
			"data":[],
			"text":"Parameters missing"
		});
	}
}); // scrap it
/**
* @params req.params.postID The post's ID
* @todo This function will fetch all the siblings of the post in question.
* @return A JSON object will be returned. If successful then every index of the array will contain a JSON object. A boolean field will be there to indicate if the process was successful. 
*/
app.get('/getSiblings/:postID',function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,child){
			if(err)
			{
				console.log(err);
				return res.status(200).json({
					status:false,
					text:err,
					data:[]
				});
			}
			if(!child)
			{
				console.log("Couldn't find the post");
				return res.status(200).json({
					status:false,
					text:"Couldn't find the post",
					data:[]
				});
			}
			if(child.parent_ID==null)
			{
				console.log("Post does not have a parent");
				return res.status(200).json({
					status:false,
					text:"Post does not have a parent",
					data:[]
				});
			}
			Posts.findById(child.parent_ID,function(err,par){
				if(err)
				{
					console.log(err);
					return res.status(200).json({
						status:false,
						text:err,
						data:[]
					});
				}
				if(!par)
				{
					console.log("Cannot find parent post");
					return res.status(200).json({
						status:false,
						text:"Cannot find parent post",
						data:[]
					});
				}
				console.log("Found siblings");
				return res.status(200).json({
					status:true,
					text:"Found siblings",
					data:par.child_list
				});
			});
		});
	}
	else
	{
		console.log("Missing parameters");
		return res.status(200).json({
			status:false,
			text:"Missing parameters",
			data:[]
		});
	}
});
app.patch('/movePost/:postID/:parentID',function(req,res,next){
	if(req.params.parentID&&req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,obj){
			if(err)
			{
				console.log("Encountered an error",err);
				return res.status(200).json({
					"status":false,
					"postID":null,
					"level":-1,
					"text":err
				});
			}
			else if(!obj)
			{
				console.log("Failed to find post");
				return res.status(200).json({
					"status":false,
					"postID":null,
					"level":-1,
					"text":"Failed to find post"
				});
			}
			else
			{
				Posts.findById(req.params.parentID,function(err,pobj){
					if(err)
					{
						console.log("Encountered error: "+err);
						return res.status(200).json({
							
						});
					}
					else if(pobj)
					{
						console.log("Found the new parent post");
						Posts.findById(obj.parent_ID,function(err,oobj){
							if(err)
							{
								console.log("Encountered error: "+err);
								res.status(200).json({
									
								});
							}
							else if(oobj)
							{
								console.log("Found the old parent post");
								for(var i=0;i<oobj.child_list.length;i++)
								{
									if(oobj.child_list[i].postID==obj._id)
										oobj.child_list.splice(i,1);
								}
								pobj.child_list.push({
									postID:obj._id,
									heading:obj.heading,
									level:obj.level_number
								});
								pobj.save(function(err,pobj){
									if(err)
									{
										console.log("Encountered error: "+err);
										res.status(200).json({
											
										});
									}
									else
									{
										obj.parent_ID=pobj._id;
										var level=obj.level_number - pobj.level_number;
									}
								});
								oobj.save(function(err,oobj){
									if(err)
										console.log("Encountered error: "+err);
								});
							}
							else
							{
								console.log("did not find the old parent post");
								res.status(200).json({
									
								});
							}
						});
					}
					else
					{
						console.log("Could not find the old parent post");
						res.status(200).json({
							
						});
					}
				});
			}
		});
	}
	else
	{
		console.log("Parameters missing");
		res.status(200).json({data:"Parameters missing"});
	}
});
var moveDFS=function(obj,level){
	if(obj)
	{
		Posts.find({"parent_ID":obj._id},function(err,doc){
			_.forEach(doc,function(doc){
				doc.level_number=doc.level_number-level;
				doc.save(function(err,obj){
					if(err)
					{
						console.log("Error saving object");
					}
					else
					{
						moveDFS(obj,level);
					}
				});
			});
		});
	}
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					/*Users*/
/**
* @body Takes in userID and password
* @todo Query user on LDAP - and add user to db if user doesn't exist
* @return A JSON object will be returned. If successful then the object will contain an array of JSON objects, otherwise there will be an error message.
*/ 
app.post('/userLogin', function(req, res, next) {
	console.log('/userLogin');
	
	var loginDetails = {
		userID: req.body.userID,
		password: req.body.password
	};
	
	var host = '127.0.0.1'; 
	var socket = new JsonSocket(new net.Socket());
	socket.connect(sBPort, host);
	socket.on('connect', function() {
		socket.sendMessage(loginDetails);
		socket.on('message', function(message) {
			var retObject = JSON.parse(message.result);
			var userDetails = {
				pseodoname: retObject.pseodoname,
				userID: retObject.userID,
				title: retObject.title, 
				initials: retObject.initials,
				name: retObject.name,
				surname: retObject.surname,
				email: retObject.email,
				cell: retObject.cell, 
				modules: retObject.modules
			};
			console.log(userDetails);
			
			//Query local DB to check if user exists
			var user = userDetails.userID;
			console.log(user);
			
			Users.findOne({'userID': user}, function(err, doc) {
				if(err) {
					return res.status(404).json('An error has occured'); 
				}
				
				else if(!doc) { //User doesn't exist - Add user
					console.log('User not in db - Adding new user');
				
					var newUser = new Users({
						pseodoname: userDetails.pseodoname,
						userID: userDetails.userID,
						title: userDetails.title, 
						initials: userDetails.initials,
						name: userDetails.name,
						surname: userDetails.surname,
						email: userDetails.email,
						cell: userDetails.cell, 
						modules: userDetails.modules
					});
					
					newUser.save(function(err, users) {
						if(err) {
							return res.status(404).json('An error has occured');
						}
						
						else if(!users) {
							console.log('User not added');
							return res.status(404).json('User not added');
						}
						
						else { //New user saved to db
							console.log(users);
							return res.status(200).json(users);
						}
					});
				}
				
				else { //User already exists in our db
					console.log('User already exists');
					return res.status(200).json(doc);
				}
			});
		});
	});
});

app.get('/display', function(req, res, next) {
	console.log('/display get');
	Users.find(function(err, users) {
		console.log("In display");
	 	console.log(users);
	 	if(err) {return next(err)};
		res.json(users);
	 });
});


//Create user - Removed See => /userLogin
//~ app.post('/createUser', function(req, res, next) {
	//~ console.log('/createUser');
	
	//~ var user = new Users(req.body);
	//~ user.save(function(err, users) {
		//~ console.log(users);
		//~ if(err) return next(err);
		//~ res.json(users).status(201);
	//~ });
//~ });

//Get user
app.get('/getUser/:userID', function(req, res, next) {
	console.log('/getUser/userID get');
	var user = req.params.userID;
	console.log('UserID = ' + user);
	Users.findOne({$or: [{'userID': user}, {'pseodoname': user}]}, function(err, doc) {
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

app.get('/getContent/:postID',function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,post){
			if(err)
			{
				console.log('Encountered error: '+err);
				return res.status(200).json({
					"status":false,
					"content":null,
					"text":err,
					"timestamp":null,
					"studentID":null,
					"heading":null,
					"tag_list":[]
				});
			}
			else if(post)
			{
				console.log('Found the post');
				return res.status(200).json({
					"status":true,
					"content":post.content,
					"text":"Found the post",
					"timestamp":post.timestamp.toLocaleString('en-GB'),
					"studentID":post.student_number,
					"heading":post.heading,
					"tag_list":post.tag_list
				});
			}
			else
			{
				console.log('Could not find post or post does not exist');
				return res.status(200).json({
					"status":false,
					"content":null,
					"text":"Could not find post or post does not exist",
					"timestamp":null,
					"studentID":null,
					"heading":null,
					"tag_list":[]
				});
			}
		});
	}
	else
	{
		console.log('No parameters received');
		return res.status(200).json({
			"status":false,
			"content":null,
			"text":"No parameters received",
			"timestamp":null,
			"studentID":null,
			"heading":null,
			"tag_list":[]
		});
	}
});
/**
* @params req.body.postID The ID of the post.
* @params req.body.student_number The ID of the user.
* @todo This will add an up vote to the post being made.
* @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
*/
app.post('/upVote',function(req,res,next){
	if(req.body.postID && req.body.student_number)
	{
		Posts.findById(req.body.postID,function(err,post){
			if(err)
			{
				console.log(err);
				return res.status(200).json({
					status:false,
					text:err
				});
			}
			if(!post)
			{
				console.log("Post cannot be found");
				return res.status(200).json({
					status:false,
					text:"Post cannot be found"
				});
			}
			Votes.find({postID:post._id},function(err,vote){
				if(err)
				{
					console.log(err);
					return res.status(200).json({
						status:true,
						text:err
					});
				}
				if(!vote)
				{
					var v=new Votes({
						postID:post._id,
						upVotes:[],
						downVotes:[]
					});
					v.save(function(err,vote){
						if(err)
						{
							console.log(err);
							return res.status(200).json({
								status:false,
								text:err
							});
						}
						vote.upVotes.push(req.body.student_number);
						vote.save(function(err,vote){
							if(err)
							{
								console.log(err);
								return res.status(200).json({
									status:false,
									text:err
								});
							}
							console.log("Successfully up voted");
							return res.status(200).json({
								status:true,
								text:"Successfully up voted"
							});
						});
					});
				}
				else
				{
					var done=0;
					_.forEach(vote.downVotes,function(vote){
						if(vote==req.body.student_number)
						{
							return res.status(200).json({
								status:false,
								text:"User already down voted this post"
							});
						}
					});
					for(var i=0;i<vote.upVotes.length;i++)
					{
						if(vote.upVotes[i]==req.body.student_number)
						{
							done=1;
							vote.upVotes.splice(i,1);
							break;
						}
					}
					if(done==0)
					{
						vote.upVotes.push(req.body.student_number);
						vote.save(function(err,vote){
							if(err)
							{
								console.log(err);
								return res.status(200).json({
									status:false,
									text:err
								});
							}
							return res.status(200).json({
								status:true,
								text:"Successfully up voted"
							});
						});
					}
					else
					{
						vote.save(function(err,vote){
							if(err)
							{
								console.log(err);
								return res.status(200).json({
									status:false,
									text:err
								});
							}
							return res.status(200).json({
								status:true,
								text:"Successfully up voted"
							});
						});
					}
				}
			});
		});
	}
	else
	{
		return res.status(200).json({
			status:true,
			text:"Missing parameters"
		});
	}
});

/**
* @params req.body.postID The ID of the post.
* @params req.body.student_number The ID of the user.
* @todo This will add an up vote to the post being made.
* @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
*/
app.post('/downVote',function(req,res,next){
	if(req.body.postID && req.body.student_number)
	{
		Posts.findById(req.body.postID,function(err,post){
			if(err)
			{
				console.log(err);
				return res.status(200).json({
					status:false,
					text:err
				});
			}
			if(!post)
			{
				console.log("Post cannot be found");
				return res.status(200).json({
					status:false,
					text:"Post cannot be found"
				});
			}
			Votes.find({postID:post._id},function(err,vote){
				if(err)
				{
					console.log(err);
					return res.status(200).json({
						status:true,
						text:err
					});
				}
				if(!vote)
				{
					var v=new Votes({
						postID:post._id,
						upVotes:[],
						downVotes:[]
					});
					v.save(function(err,vote){
						if(err)
						{
							console.log(err);
							return res.status(200).json({
								status:false,
								text:err
							});
						}
						vote.downVotes.push(req.body.student_number);
						vote.save(function(err,vote){
							if(err)
							{
								console.log(err);
								return res.status(200).json({
									status:false,
									text:err
								});
							}
							console.log("Successfully down voted");
							return res.status(200).json({
								status:true,
								text:"Successfully down voted"
							});
						});
					});
				}
				else
				{
					var done=0;
					_.forEach(vote.upVotes,function(vote){
						if(vote==req.body.student_number)
						{
							return res.status(200).json({
								status:false,
								text:"User already up voted this post"
							});
						}
					});
					for(var i=0;i<vote.downVotes.length;i++)
					{
						if(vote.downVotes[i]==req.body.student_number)
						{
							done=1;
							vote.downVotes.splice(i,1);
							break;
						}
					}
					if(done==0)
					{
						vote.downVotes.push(req.body.student_number);
						vote.save(function(err,vote){
							if(err)
							{
								console.log(err);
								return res.status(200).json({
									status:false,
									text:err
								});
							}
							return res.status(200).json({
								status:true,
								text:"Successfully down voted"
							});
						});
					}
					else
					{
						vote.save(function(err,vote){
							if(err)
							{
								console.log(err);
								return res.status(200).json({
									status:false,
									text:err
								});
							}
							return res.status(200).json({
								status:true,
								text:"Successfully down voted"
							});
						});
					}
				}
			});
		});
	}
	else
	{
		return res.status(200).json({
			status:true,
			text:"Missing parameters"
		});
	}
});
/**
* @params None
* @todo Will return all the votes. It is intended for testing purposes.
* @return A JSON object will returned. It will contain an array fielded with all the vote objects. 
*/
app.get('/getAllVotes',function(req,res,next){
	Votes.find({},function(err,votes){
		if(err)
		{
			console.log(err);
			return res.status(200).json({
				arr:[]
			});
		}
		return res.status(200).json({
			arr:votes
		});
	});
});

/**
* @params req.params.postID The ID of the post.
* @todo The function will return the number of up votes of a particular post.
* @return A JSON object will be returned. It will contain a boolean field to state if the process went well. There will also be a field with the number of up votes.
*/
app.get('/getUpVotes/:postID',function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,post){
			if(err)
			{
				console.log(err);
				return res.status(200).json({
					status:false,
					text:err,
					num:-1
				});
			}
			if(!post)
			{
				console.log("There is no post with this ID");
				return res.status(200).json({
					status:false,
					num:-1,
					text:"There is no post with this ID"
				});
			}
			Votes.find({postID:post._id},function(err,vote){
				if(err)
				{
					console.log(err);
					return res.status(200).json({
						status:false,
						num:-1,
						text:err
					});
				}
				if(!vote)
				{
					console.log("There is no vote for this post");
					return res.status(200).json({
						status:true,
						num:0,
						text:"There is no vote for this post"
					});
				}
				return res.status(200).json({
					status:true,
					num:vote.upVotes.length,
					text:"Successfully found votes"
				});
			});
		});
	}
	else
	{
		return res.status(200).json({
			status:false,
			num:-1,
			text:"Missing parameters"
		});
	}
});

/**
* @params req.params.postID The ID of the post.
* @todo The function will return the number of down votes of a particular post.
* @return A JSON object will be returned. It will contain a boolean field to state if the process went well. There will also be a field with the number of up votes.
*/
app.get('/getDownVotes/:postID',function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,post){
			if(err)
			{
				console.log(err);
				return res.status(200).json({
					status:false,
					text:err,
					num:-1
				});
			}
			if(!post)
			{
				console.log("There is no post with this ID");
				return res.status(200).json({
					status:false,
					num:-1,
					text:"There is no post with this ID"
				});
			}
			Votes.find({postID:post._id},function(err,vote){
				if(err)
				{
					console.log(err);
					return res.status(200).json({
						status:false,
						num:-1,
						text:err
					});
				}
				if(!vote)
				{
					console.log("There is no vote for this post");
					return res.status(200).json({
						status:true,
						num:0,
						text:"There is no vote for this post"
					});
				}
				return res.status(200).json({
					status:true,
					num:vote.downVotes.length,
					text:"Successfully found votes"
				});
			});
		});
	}
	else
	{
		return res.status(200).json({
			status:false,
			num:-1,
			text:"Missing parameters"
		});
	}
});
var debug   = require('debug')('kumladi-api:controllers:csStatus');
/**
* @params req.params.studentID This will hold the user's student number.
* @params req.params.course_code This will hold the user's course code.
* @todo The function will check if the user belongs to the particular course module.
* @return A JSON object is returned. The object will contain a boolean variable which will be true if nothing goes wrong in the function. A data field will either be null or have the user's status symbol. A text field will hold information about what happened in the function.
*/
app.get('/getStatus/:studentID/:course_code',function(req,res,next){
	if(req.params.studentID&&req.params.course_code)
	{
		csStatus.find({userID:req.params.studentID,courseCode:req.params.course_code},function(err,obj){
			if(err)
			{
				debug("Encountered error: "+err);
				res.status(200).json({
					"status":false,
					"text":err,
					"data":null
				});
			}
			else if(obj)
			{
				debug("found the cs status");
				res.status(200).json({
					"status":true,
					"text":"found the cs status",
					"data":obj.status
				});
			}
			else
			{
				debug("did not find the user");
				res.status(200).json({
					"status":true,
					"text":"did not find the user",
					"data":null
				});
			}
		});
	}
	else
	{
		debug("Missing parameters");
		res.status(200).json({
			"status":false,
			"text":"Missing parameters",
			"data":null
		});
	}
});

/**
* @params req.params.studentID This will hold the student number.
* @todo The function will search for the user's information. All of the user's course module and the status for the module will be collected as well.
* @return A JSON object will be returned. A boolean field will state if the function went well. A text field will give information about what happens in the function. A data field will contain an array of objects.
*/
app.get('/getUserInfo/:studentID',function(req,res,next){
	if(req.params.studentID)
	{
		csStatusS.find({userID:req.params.studentID},function(err,obj){
			var docs=[];
			if(err)
			{
				debug("Encountered error: "+err);
				res.status(200).json({
					"status":false,
					"text":err,
					"data":[]
				});
			}
			else if(obj)
			{
				_.forEach(obj,function(doc){
					docs.push({
						"course_code":doc.courseCode,
						"symbol":doc.status
					});
				});
				if(docs.length==0)
				{
					debug("no users found");
					res.status(200).json({
						"status":true,
						"text":"no users found",
						"data":[]
					});
				}
				else
				{
					debug("users found");
					res.status(200).json({
						"status":true,
						"text":"users found",
						"data":docs
					});
				}
			}
			else
			{
				debug("no user objects found");
				res.status(200).json({
					"status":false,
					"text":"no user objects found",
					"data":[]
				});
			}
		});
	}
	else
	{
		debug("missing parameters");
		res.status(200).json({
			"status":false,
			"text":"missing parameters",
			"data":[]
		});
	}
});

/**
* @params req.params.course This will hold the course module.
* @todo The function will search for the course's information. All of the course module's users and the status of the user will be collected.
* @return A JSON object will be returned. A boolean field will state if the function went well. A text field will give information about what happens in the function. A data field will contain an array of objects.
*/
app.get('/getCourseInfo/:course',function(req,res,next){
	if(req.params.course)
	{
		csStatusS.find({courseCode:req.params.course},function(err,obj){
			var docs=[];
			if(err)
			{
				debug("Encountered error: "+err);
				res.status(200).json({
					"status":false,
					"text":err,
					"data":[]
				});
			}
			else if(obj)
			{
				_.forEach(obj,function(doc){
					docs.push({
						"studentID":doc.userID,
						"symbol":doc.status
					});
				});
				if(doc.length==0)
				{
					debug("found no course module");
					res.status(200).json({
						"status":true,
						"data":[],
						"text":"found no course module"
					});
				}
				else
				{
					debug("found course module");
					res.status(200).json({
						"status":true,
						"data":docs,
						"text":"found course module"
					});
				}
			}
			else
			{
				debug("The course module was not found");
				res.status(200).json({
					"status":false,
					"data":[],
					"text":"The course module was not found"
				});
			}
		});
	}
	else
	{
		debug("Missing parameters");
		res.status(200).json({
			"status":false,
			"data":[],
			"text":"missing parameters"
		});
	}
});

/**
* @params req.params.status This will hold the status symbol.
* @todo The function will search for the status symbol's information. All of the status symbol's users and the course module of the status symbol will be collected.
* @return A JSON object will be returned. A boolean field will state if the function went well. A text field will give information about what happens in the function. A data field will contain an array of objects.
*/
app.get('/getStatusInfo/:status',function(req,res,next){
	if(req.params.status)
	{
		csStatusS.find({status_symbol:req.params.status},function(err,obj){
			var docs=[];
			if(err)
			{
				debug("Encountered error: "+err);
				res.status(200).json({
					"status":false,
					"text":err,
					"data":[]
				});
			}
			else if(obj)
			{
				_.forEach(obj,function(doc){
					docs.push({
						"studentID":doc.userID,
						"course":doc.courseCode
					});
				});
				if(doc.length==0)
				{
					debug("found no status");
					res.status(200).json({
						"status":true,
						"data":[],
						"text":"found no status"
					});
				}
				else
				{
					debug("found no status");
					res.status(200).json({
						"status":true,
						"data":docs,
						"text":"found status"
					});
				}
			}
			else
			{
				debug("found no status");
				res.status(200).json({
					"status":false,
					"data":[],
					"text":"found no status"
				});
			}
		});
	}
	else
	{
		debug("missing parameters");
		res.status(200).json({
			"status":false,
			"text":"missing parameters",
			"data":[]
		});
	}
});


app.listen(port, ()=> console.log("Server running at " + port));
