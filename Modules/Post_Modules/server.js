var mongoose = require('mongoose'); 
//var console.log       = require('console.log')('kumLadi-api:controllers:post');
 
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/post-db') //NB - use: post-db
.then(() => console.log('Connection successful'))
.catch((err) => console.log(err));
console.log('Initialising model: post');
var Post_module = new mongoose.Schema({
   heading: {
     type: String,
	 required:true
   }, 

   level_number: { 
     type: Number,
	 required:true  
   }, 

   child_list: {
   	 type: [],
	 required:true
   }, 

   tag_list: {
     type: [String],
	 required:true
   }, 

   parent_ID: { 
     type: mongoose.Schema.Types.Mixed,
	   ref:'Post_module',
	 required:true
   }, 
// have a default preference
   content: {
   	 type: String,
	 required:true
   }, 

   course_code: {
     type: String,
	 required:true
   }, 

   student_number: {
     type: String,
	 required:true
   }, 

   timestamp : {
     type: Date,
	 default: Date.now,
	 required:true
   },
   visibility:{
	   type:Boolean,
	   default: true,
	 required:true
   }
});

mongoose.model('postModule', Post_module);

var Posts = mongoose.model('postModule', Post_module);
var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ =require("lodash");

app.use(express.static(__dirname + '/public')); // I am not to sure about this line

let bodyParser = require('body-parser');
//For adding middleware to application
//app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


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
				res.status(200).send({"data":err});
			}
			else if(!obj)
			{
				console.log("Failed to save the document. May be missing parameters");
				return res.status(200).json({"data":"Failed to save the document. May be missing parameters"});
			}
			else
			{
				 var response = {
					 data: {
						 type: 'Post', 
						 docID: obj.id, 
						 attributes: {
							 heading: obj.heading
						 }
					 }
				 };
				 
				 /*res.status(200).send({
					post_ID:obj._id,
					heading:obj.heading*/
				 console.log('Sending response (status: 200)');
				 return res.status(200).json(response);
			 }
				
		});
});
/**
* @params req.params.postID The ID of the post to be updated.
* @params req.body.tag_list The taglists to be added.
* @todo The post to be edited will be found using it's ID then the tag list will be updated.
* @return A JSON object will be returned. If successful then it will contain the post's ID, otherwise it an error message will be in the object.
*/
app.patch('/editPost/:postID',function(req,res,next){ //Not working
	if(req.params.postID && req.body.content)
	{
		Posts.find({"_id":req.params.postID},function(err,doc){
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
						console.log("Successfully removed the document");
						res.status(200);
						return res.json({
							"status":true,
							"data":"Successfully removed the document"
						});
					}
				});
			}
		});
	}
});

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
								level:savedDoc.level_number
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
	Posts.find({},['_id','heading'],{skip:0,limit:5,sort:{"timestamp":-1}},function(err,doc){
		var docs=[];
		if(err)
		{
			console.log("Encountered error");
			res.status(200).json({
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
				return res.status(200).json({
					"status":true,
					"data":post.child_list,
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


app.get('/getContent/:postID',function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,post){
			if(err)
			{
				console.log('Encountered error: '+err);
				res.status(200).json({
					"status":false,
					"content":null,
					"text":err,
					"timestamp":null,
					"studentID":null,
					"heading":null
				});
			}
			else if(post)
			{
				console.log('Found the post');
				res.status(200).json({
					"status":true,
					"content":post.content,
					"text":"FOund the post",
					"timestamp":post.timestamp,
					"studentID":post.student_number,
					"heading":post.heading
				});
			}
			else
			{
				console.log('Could not find post or post does not exist');
				res.status(200).json({
					"status":false,
					"content":null,
					"text":"Could not find post or post does not exist",
					"timestamp":null,
					"studentID":null,
					"heading":null
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
			"heading":null
		});
	}
});
app.listen(3000, ()=> console.log("Server running at 3000"))