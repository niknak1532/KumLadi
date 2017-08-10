var _       = require('lodash');
var debug   = require('debug')('kumladi-api:controllers:posts');
var Posts     = require('../../models/post');
var id=require('mongoose').Types.ObjectId;
debug('Initialising the comment controller');

/**
* @params req.params.parentID This will hold the ID of the parent post.
* @params req.body.student_number This will hold the student number of the student who he appending to the post.
* @params req.body.content This will be the content that will be attached to the post.
* @params req.body.tag_list This will be the array of chosen tags, which will be attached to the post.
* @todo The post will be created and then linked to the parent post.
* @return A JSON object will be returned. If the appending operation was successful then the JSON object will carry the new post's ID, otherwise an error message will be in the JSON object.
*/
module.exports.appendPost=function(req,res,next){
	if(!req.params.parentID)
	{
		debug("No parameters found");
		res.status(405).send("No parameters found");
	}
	Posts.findById(req.params.parentID,function(err,post){
		if(err)
		{
			console.log("An error was encoutered",err);
			res.status(504).send({"data":err});
		}
		else if(!post)
		{
			console.log("Failed to find the post");
			res.status(405).send({"data":"Failed to find the post"});
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
			debug("Inserting at id "+post._id);
			doc.save(function(err,savedDoc){
				if(err)
				{
					console.log("There was an error saving the document",err);
					//res.status(405).send({"data":err});
				}
				if(!savedDoc)
				{
					console.log("Document failed to save");
					res.status(504).send({"data":"Failed to save the document"});
				}
				else
				{
					console.log("Successfully saved document");
					Posts.findById(savedDoc.parent_ID,function(err,newDoc){
						if(err)
						{
							console.log("Encountered an error when trying to find and update the parent post",err);
							res.status(504).send({"data":"Failed to find and update parent post"});
						}
						else if(!newDoc)
						{
							console.log("Failed to update the parent post");
							res.status(504).send({"data":"Failed to update the parent post"});
						}
						else
						{
							//debug("Child list: "+newDoc.child_list[0]);
							newDoc.child_list.push(savedDoc);
							newDoc.save(function(err,obj){
								if(err)
								{
									debug("Encountered error");
								}
							});
							console.log("Successfully appended to post");
							res.status(200).send({"data":"Successfully appended to post"});
						}
					});
				}
			});
		}
	});
};

/**
* @params req.params.course_code The course code searched for
* @todo All posts will be sorted by the dates created and the most recent five posts will be picked.
* @return A JSON object will be returned. If documents were found then an array with them will be returned, otherwise there will be no array.
*/ 
module.exports.getLatestPosts=function(req,res,next){
	console.log("Finding all documents");
	Posts.find({},['_id','heading'],{skip:0,limit:5,sort:{"timestamp":1}},function(err,doc){
		var docs=[];
		if(err)
		{
			debug("Encountered error");
			res.status(504).send("Encountered error");
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
			debug("Could not find any documents in the database");
			res.status(504).send({"data":"Could not find any documents in the database"});
		}
		else
		{
			var result={first:docs,data:"Successfully found the most recent posts"};
			res.status(200).send(result);
		}
	});
};

/**
* @params req.params.postID The ID of the post.
* @todo All the child posts of the post will be found and sorted in ascending order according to their timestamps. The documents' IDs and heading will be stored in an array.
* @return A JSON object will be returned. If successful then the object will contain an array of JSON objects, otherwise there will be an error message.
*/ 
module.exports.getChildPosts=function(req,res,next){
	if(req.params.postID)
	{
		Posts.find({"parent_ID":req.params.parent_ID},['heading','_id','level_number'],{sort:{"timestamp":1}},function(err,doc){
			var docs=[];
			if(err)
			{
				debug("Encountered error");
				res.status(504).send({data:"Encountered error"});
			}
			if(doc)
			{
				_.forEach(doc,function(u){
					docs.push({
						heading:u.heading,
						postID:u._id,
						level:u.level_number
					});
				})
			}
			if(docs.length==0)
			{
				debug("No documents were found");
			}
			else 
			{
				debug("Documents found and saved");
			}
			res.status(200).send({result:docs});
		});
	}
	else
	{
		debug("No parameters found");
		res.status(405).send({data:"No parameters found"});
	}
};

/**
* @params req.params.course_code The course code for the posts to be found.
* @todo All the posts will be sorted in ascending order then their IDs and heading will be returned.
* @return A JSON object will be returned. If successful then every index of the array will contain a JSON object.
*/ 
module.exports.getPosts=function(req,res,next){
	if(req.params.course_code)
	{
		Posts.find({"level_number":0,"course_code":req.params.course_code},['_id','heading','level_number'],{sort:{"timestamp":-1}},function(err,doc){
			var docs=[];
			if(doc)
			{
				_.forEach(doc,function(u){
					docs.push({
						postID:u._id,
						heading:u.heading,
						level:u.level_number
					});
					//debug("Post: "+u._id);
				});
				
			}
			if(err)
			{
				debug("Encountered error");
				res.status(504).send({data:"Encountered error"});
			}
			if(docs.length==0)
			{
				console.log("No posts");
				res.status(200).send({data:"No posts"});
			}
			else
			{
				res.status(200).send({data:"posts found",results:docs});
			}
		});
	}
	else
	{
		debug("Parameters missing");
		res.status(405).send({data:"Parameters missing"});
	}
};

var dfs=function(arr){
	if(arr.length>0)
	{
		var i=0;
		//debug(arr[0].children.length);
		for(;i<arr.length;i++)
		{
			debug("In DFS");
			Posts.find({'parent_ID':arr[i].postID},['_id','heading','level_number'],{sort:{"timestamp":-1}},function(err,doc){
				var t=[];
				if(err)
				{
					debug("Encountered error");
					res.status(504).send({data:"Encountered error"});
				}
				else if(doc)
				{
					//debug("Found "+doc.length+" children");
					//arr[i].children=new Array();
					_.forEach(doc,function(doc){
						t.push({
							postID:doc._id,
							heading:doc.heading,
							level:doc.level_number,
							children:[]//new Array()
						});
						//_.forEach(arr.children[arr.children.length-1],function(u){
							//debug("Found post: "+arr.children[arr.children.length-1].postID);
						//})
						
					});
					debug(arr[0].children.length);
					arr[0].children=t;
					for(i=0;i<arr[0].children.length;i++)
					{
						dfs(arr[0].children);
					}
				}
			});
		}
		
	}
};

module.exports.movePost=function(req,res,next){
	if(req.params.parentID&&req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,obj){
			if(err)
			{
				console.log("Encountered an error",err);
				res.status(504).send({data:err});
			}
			else if(!obj)
			{
				console.log("Failed to find post");
				res.status(200).send({data:"Failed to find post"});
			}
			else
			{
				Posts.findByIdAndUpdate(req.params.parentID,{"$push":{"child_list":obj._id}},function(err,newObj){
					if(err)
					{
						console.log("Encountered error when updating parent",err);
						res.status(504).send({data:"Encountered error when updating parent"});
					}
					else if(!newObj)
					{
						debug("Failed to update parent post");
						res.status(504).send({data:"Failed to update parent post"});
					}
					else
					{
						Posts.findByIdAndUpdate(newObj.parent_ID,{"$pull":{"child_list":obj._id}},function(err,u){
							if(err)
							{
								debug("Encountered error",err);
							}
						});
						var newLevel=obj.level_number-newObj.level_number;
						Posts.findByIdAndUpdate(obj._id,{"level_number":obj.level_number-newLevel},function(err,newObj){
							if(err)
							{
								debug("Encountered error",err);
								res.status(504).send({data:err});
							}
							else if(!newObj)
							{
								debug("Failed to update post level");
								res.status(504).send({data:"Failed to update post level"});
							}
							else
							{
								moveDFS(newObj,newLevel);
							}
						});
					}
				});
				
			}
		});
	}
	else
	{
		debug("Parameters missing");
		res.status(405).send({data:"Parameters missing"});
	}
};

var moveDFS=function(obj,level){
	if(obj)
	{
		Posts.find({"parent_ID":obj._id},function(err,doc){
			_.forEach(doc,function(doc){
				doc.level_number=doc.level_number-level;
				doc.save(function(err,obj){
					if(err)
					{
						debug("Error saving object");
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