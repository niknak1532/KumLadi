/** 
*	assuming that the databases name is 'db' and 
*	for this module the collections are 'messages',
*	'threads' and 'posts'.
*/
var mongodb= require('mongodb');
var Message_module=require('../../models/message');
var Thread=require('../../models/thread');
var Post=require('../../models/post');
var mongoose=require('mongoose');
/**
*	@param req.body The parameters (module_code) of the function will be in the body
* 	@todo Creating the message container for the different modules
*	@return Nothing
*/
module.exports.create=function(req,res,next)
{
	// I am not sure how you will pass the parameters, but feel free to edit it 
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	mongo.connect(url,function(err, db)
						{
							if(err) 
							{
								console.log('Unable to connect to server',err);
								return;
							}
							else
							{
								console.log('Connected to the database');
								var mesg = new Message_module({
									module_code: req.body.module_code
								});
								var messages=db.collections('mesages');
								
								db.messages.find({module_code:mesg.module_code}).toArray(function(err,result)
																		{
																			if(err) res.send(err); // not really sure how we will handle the errors
																			if(result.length) return;
																			
																			db.messages.insert(mesg);
																		});
							}
						});
	mongo.close();
};

/**
*	@param req.params The parameters (module_code, thread_name,student_number) will be passed from here
* 	@todo Creating the thread of the particular module
*	@return Returns error message if there is one
*/
module.exports.createThread=function(req,res,next)
{
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	mongo.connect(url,function(err, db)
						{
							db.messages.find({module_code:req.params.module_code},function(err,result)
																				{
																					if(err)
																					{
																						var errorMessage={
																							"errorText":"Failed to create thread"
																						};
																						res.status(405).send(errorMessage);
																					}
																					var newId=new mongoose.Types.ObjectId;
																					
																					var newThread=new Thread({
																						// personally creating the docs ID that way I save it and know 
																						// which object to look for using its ID
																						_id: newId, 
																						student_number: req.params.student_number,
																						thread_name: req.params.thread_name
																					});
																					//inserting a new thread
																					db.threads.insert(newThread);
																					// updating the messages.thread_name array
																					db.messages.update({"module_code":req.params.module_code},{"$push":{"thread_name":newId}},function(err,result){});
																				});
						});
	mongo.close();
};
/**
*	@param req.params The parameters (thread_name,student_number,post_tags,[post_tags],post_desc) will be passed from here.
* 	@todo Creating the post of the particular thread.
*	@return Returns error message if there is one. Returns the new post's id to be used later on. Everything is returned in JSON format.
*/
module.exports.createPost=function(req,res,next)
{
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	var response={data:"Could not connect to database"};
	var statusNumber=500;
	mongo.connect(url,function(err, db)
						{
							if(!err)
							{
								var threads=db.collections('threads');
								var posts=db.collections('posts');
								db.threads.find({"thread_name":req.params.thread_name}).toArray(function(err,result)
																								{
																									if(err)
																									{
																										console.log("Could not find thread: "+req.params.thread_name,err);
																										response.data="Could not find thread";
																										statusNumber=405;
																									}
																									else
																									{
																										var newId=new mongoose.Types.ObjectId;
																										var entry=new Post({
																											_id:newId,
																											student_number:req.params.student_number,
																											post_desc:req.params.post_desc,
																											post_tags:req.params.post_tags,
																											visibility:true
																										});
																										db.threads.update({"thread_name":req.params.thread_name},{"$push":{"post":newId,"participants":entry.student_number}});
																										db.posts.insert(entry);
																										response={
																											data:"Successfully created post",
																											postID:newId
																										};
																										statusNumber=200;
																										console.log(response.data);
																									}
																								});
							}
							else
							{
								console.log(response.data,err);
							}
						});
	
	mongo.close();
	res.status(statusNumber);
	res.send(response);
};
/**
*	@param req.params The parameters (postID,student_number,comment) will be passed from here
* 	@todo Creating the comment of the particular post
*	@return Returns status and message of the actions taken
*/
module.exports.createComment=function(req,res,next)
{
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	var response={data:"Failed to connect to the database"};
	var statusNumber=500;
	mongo.connect(url,function(err, db)
						{
							if(!err)
							{
								var threads=db.collections('threads');
								var posts=db.collections('posts');
								db.posts.find({"_id":req.params.postID}).toArray(function(err,result)
																				{
																					if(err || result.length==0)
																					{
																						console.log("Failed to find the post");
																						if(errr) console.log(err);
																						statusNumber=405;
																						response={data:"Could not find the post"};
																					}
																					else
																					{
																						var newEntry={
																							student_number:req.params.student_number,
																							comment:req.params.comment
																						};
																						db.posts.update({"_id":req.params.postID},{"$push":{post_comments:newEntry}});
																						statusNumber=200;
																						response={
																							data:"Successfully added commented"
																						};
																					}
																				});
							}
							else
							{
								console.log(response.data);
							}
						});
	mongo.close();
	res.status(statusNumber);
	res.send(response);
};
/**
*	@param req.params The parameters (postID,student_number) will be passed from here.
* 	@todo Up votes the post.
*	@return Returns status and message of the actions taken. Everything is returned in JSON format.
*/
module.exports.upVote=function(req,res,next)
{
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	var response={data:"Failed to connect to the database"};
	var statusNumber=500;
	mongo.connect(url,function(err, db)
						{
							if(!err)
							{
								var posts=db.collections('posts');
								db.posts.find({"_id":req.params.postID,"up_votes":req.params.student_number}).toArray(function(err,result)
																				{
																					if(err || result.length!=0)
																					{
																						if(err) response.data="Failed to find the post";
																						if(result.length!=0) response.data="Already up voted";
																						statusNumber=405;
																						console.log(response.data);
																					}
																					else
																					{
																						db.posts.update({"_id":req.params.postID},{"$push":{"up_votes":req.params.student_number}});
																						statusNumber=200;
																						response.data="Successfully up voted";
																						console.log(response.data);
																						db.posts.update({"_id":req.params.postID},{"$pull":{"down_votes":req.params.student_number}})
																					}
																				});
							}
							else
							{
								console.log(response.data);
							}
						});
	mongo.close();
	res.status(statusNumber);
	res.send(response);
};
/**
*	@param req.params The parameters (postID) will be passed from here.
* 	@todo A post will be removed.
*	@return Returns status and message of the actions taken. Everything is returned in JSON format.
*/
module.exports.removePost=function(req,res,next)
{
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	var response={data:"Failed to connect to the database"};
	var statusNumber=500;
	mongo.connect(url,function(err, db)
						{
							if(!err)
							{
								var posts=db.collections('posts');
								db.posts.find({"_id":postID}).toArray(function(err,result)
																	{
																		if(err|| result.length==0)
																		{
																			response.data="Could not find the post";
																			statusNumber=405;
																			console.log(response.data);
																			if(err) console.log(err);
																			else console.log(response.data);
																		}
																		else
																		{
																			db.posts.update({"_id":postID},{visibility:false});
																			response.data="Successfully removed the post";
																			statusNumber=200;
																		}
																	});
							}
							else
							{
								console.log(response.data);
							}
						});
	mongo.close();
	res.status(statusNumber);
	res.send(response);
};

/**
*	@param req.params The parameters (postID,student_number) will be passed from here.
* 	@todo Down votes the post.
*	@return Returns status and message of the actions taken. Everything is returned in JSON format.
*/
module.exports.downVote=function(req,res,next)
{
	var mongo=mongodb.MongoClient;
	var url='mongodb://localhost:27017/db';
	var response={data:"Failed to connect to the database"};
	var statusNumber=500;
	mongo.connect(url,function(err, db)
						{
							if(!err)
							{
								var posts=db.collections('posts');
								db.posts.find({"_id":req.params.postID,"down_votes":req.params.student_number}).toArray(function(err,result)
																				{
																					if(err || result.length!=0)
																					{
																						if(err) response.data="Failed to find the post";
																						if(result.length!=0) response.data="Already down voted";
																						statusNumber=405;
																						console.log(response.data);
																					}
																					else
																					{
																						db.posts.update({"_id":req.params.postID},{"$pull":{"up_votes":req.params.student_number}});
																						statusNumber=200;
																						response.data="Successfully down voted";
																						console.log(response.data);
																						db.posts.update({"_id":req.params.postID},{"$push":{"down_votes":req.params.student_number}})
																					}
																				});
							}
							else
							{
								console.log(response.data);
							}
						});
	mongo.close();
	res.status(statusNumber);
	res.send(response);
};
