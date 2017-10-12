var mongoose = require('mongoose');
var async=require("async");

mongoose.Promise = global.Promise;
var connectionToPost=mongoose.createConnection('mongodb://KamoKG:buzzTestPost1234@ds119044.mlab.com:19044/post-db');
var connectionToUser=mongoose.createConnection('mongodb://nathi:2580456Nn@ds161483.mlab.com:61483/kumladi-users-db');
var connectionToChat = mongoose.createConnection('mongodb://KamoKG:buzzTestPost1234@ds151024.mlab.com:51024/chat-db');

//~ var connectionToPost = mongoose.createConnection('mongodb://localhost/post-db');
//~ var connectionToUser = mongoose.createConnection('mongodb://localhost/user-db');
//~ var connectionToChat = mongoose.createConnection('mongodb://localhost/chat-db');


console.log('Initialising model: post');
var Post_module = new mongoose.Schema({
	heading: {
		type: String
	},
	viewed:{
		type:[]
	},
	emoji:{
		type:String,
		default:null
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
	course_code:{
		type:String
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

    modules: {
        type: [String]
    },

    pseodoname: {
        type: String
    },

    groupsJoinedTo: {
        type: [String]
    },

    photo: {
        type: String
    },
    
    password: {
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
    },

    current_points: {
        type: Number,
        default: 0
    },

    current_bounty: {
        type: Number,
        default: 0
    }
});

console.log('Initializing model: Group');
var Group_module = new mongoose.Schema({
    initiator: {
        type: String,
        required: true
    },

    peers: {
        type: [String], //pseodoname || studentNumber
        required: true
    },

    groupName: {
        type: String,
        required: true
    },

    expiry_date: {
        type: Date,
        default: Date.now
    },

    bountyNeeded: {
        type: Number
    }
});

console.log('Initializing model: Chat');
var messageModule=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    creator:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    levels:{
        type:Number,
        required:true
    },
    linkToGroup:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    }
});

console.log('Initialising model: Subscribed post');
var sub_Posts = new mongoose.Schema({
    userID: {
        type: String
    },
    postID: {
        type: mongoose.Schema.Types.Mixed
    }
});

console.log('Initialising model: milestones');
var milestonesSchema = new mongoose.Schema({
    milestoneName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    usersCompletedMilestone: {
        type: [String]
    },

    reward: {
        type: Number,
        required: true
    },

    expiry_date: {
        type: Date,
        default: Date.now
    }
})

var csStatus = connectionToUser.model('csStatus', csStatusSchema);
var csStatusS=csStatus;
var Users=connectionToUser.model('User', UserSchema);
var Votes=connectionToPost.model('votemodule',VoteSchema);
var Posts = connectionToPost.model('postModule', Post_module);
var groupChat = connectionToChat.model('groupChat', Group_module);
var Messages = connectionToChat.model('messageChat', messageModule);
var SubThreads = connectionToUser.model('subPost', sub_Posts);
var milestone = connectionToPost.model('milstone', milestonesSchema);

var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ =require("lodash");
var path = require('path');
var cors = require('cors');
var file = require('./serverA.js');
var nodemailer = require('nodemailer');

app.use(express.static(path.join(__dirname + '/public/dist')));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3000;

var ldapModuleResponse = null;
//**************************************************8
//              New additions
//**************************************************8

/**
* @param req.params.userID The user's ID.
* @todo All the user's posts and votes made will be counted, for each and every one of their modules. 
*/
app.get("/attempt/:userID",function(req,res,next){
	Users.findOne({userID:req.params.userID},function(err,user){
		if(err)
		{
			console.log("Error: "+err);
			return res.status(200).json({
				status:false,
				text:err
			});
		}
		if(user)
		{
			async.parallel([
				function(callBack){
					var count =0;
					var docs=[];
					_.forEach(user.modules,function(code){
						Posts.find({student_number:req.params.userID,course_code:code},function(err,posts){
							if(err)
							{
								console.log("Error: "+err);
							}
							if(posts.length)
							{
								docs.push({
									numPosts:posts.length,
									module:code
								});
							}
							else
							{
								docs.push({
									numPosts:0,
									module:code
								})
							}
							if((++count)==user.modules.length)
							{
								callBack(null,docs);
							}
						});
					});
				},
				function(callBack){
					var count =0;
					var docs=[];
					_.forEach(user.modules,function(code){
						Votes.find({course_code:code},function(err,votes){
							if(err)
							{
								console.log("Error: "+err);
							}
							if(votes.length)
							{
								var num=0;
								for(var i=0;i<votes.length;i++)
								{
									for(var j=0;j<votes[i].upVotes.length;j++)
									{
										if(votes[i].upVotes[j]==req.params.userID)
										{
											num++;
										}
									}
									for(var j=0;j<votes[i].downVotes.length;j++)
									{
										if(votes[i].downVotes[j]==req.params.userID)
										{
											num++;
										}
									}
								}
								console.log("Found votes in "+code+" for user "+req.params.userID);
								docs.push({
									numVotes:num,
									module:code
								});
							}
							else
							{
								console.log("Found no votes in "+code+" for user "+req.params.userID);
								docs.push({
									numVotes:0,
									module:code
								});
							}
							if((++count)==user.modules.length)
							{
								callBack(null,docs);
							}
						});
					});
				}
			], 
			function(err,results){
				if(err)
				{
					console.log("Error: "+err);
					return res.status(200).json({
						status:false,
						text:err
					});
				}
				return res.status(200).json({
					status:true,
					text:results
				});
			});
			
		}
		else
		{
			console.log("User does not exist");
			return res.status(200).json({
				status:false,
				text:"User does not exit"
			});
		}
	});
	
});
/**
* @params req.params.postID The child post's ID.
* @todo It will find the child post's parent, if it exists.
*/
app.get("/getParent/:postID",function(req,res,next){
	if(req.params.postID)
	{
		Posts.findById(req.params.postID,function(err,child){
			if(err)
			{
				console.log("Error: "+err);
				return res.status(200).json({
					status:false,
					text:err,
					data:{}
				});
			}
			else if(!child)
			{
				console.log("Child post does not exist");
				return res.status(200).json({
					status:false,
					text:"Child post does not exist",
					data:{}
				});
			}
			else if(child.parent_ID==null)
			{
				console.log("Child post has no parent");
				return res.status(200).json({
					status:true,
					text:"Child post does not exist",
					data:{}
				});
			}
			else
			{
				Posts.findById(child.parent_ID,function(err,par){
					if(err)
					{
						console.log("Error: "+err);
						return res.status(200).json({
							status:false,
							text:err,
							data:{}
						});
					}
					else if(!par)
					{
						console.log("Parent post does not exist");
						return res.status(200).json({
							status:false,
							text:"Parent post does not exist",
							data:{}
						});
					}
					else
					{
						console.log("Parent post found");
						return res.status(200).json({
							status:true,
							text:"Parent post does not exist",
							data:{
								postID:par._id,
								heading:par.heading
							}
						});
					}
				});
			}
		});
	}
	else
	{
		console.log("Missing parameters");
		return res.status(200).json({
			status:false,
			text:"Missing parameters",
			data:{}
		});
	}
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Posts*/
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
            else if(doc.length)
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
                    "status":true,
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
        return res.status(200).json({
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
                heading:((req.body.heading)? req.body.heading : post.heading),
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
    Posts.find({"visibility":true,"course_code":req.params.course_code},['_id','heading','student_number','timestamp'],{skip:0,limit:5,sort:{"timestamp":-1}},function(err,doc){
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
            for(var i in doc){
				var u=doc[i];
                var pass={
                    postID:u._id,
                    heading:u.heading,
                    userID:u.student_number,
                    timestamp:u.timestamp
                };
                docs.push(pass);
            }
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
app.get('/getChildPosts/:postID/:userID',function(req,res,next){
    if(req.params.postID&&req.params.userID)
    {
		console.log("PostID: "+mongoose.Types.ObjectId(req.params.postID));
        Posts.find({parent_ID:mongoose.Types.ObjectId(req.params.postID)},["_id","heading","student_number","timestamp","course_code","parent_ID"],{sort:{timestamp:-1}},function(err,post){
            if(err)
            {
                console.log('Encountered error: '+err);
                return res.status(200).json({
                    "status":false,
                    "data":[],
                    "text":err
                });
            }
            else if(post.length)
            {
				var docs=[];
				for(var i=0;i<post.length;i++)
				{
					docs.push({
						postID:post[i]._id,
						userID:post[i].student_number,
						timestamp:post[i].timestamp,
						viewed:false,
						heading:post[i].heading,
						module:post[i].course_code,
						parent:post[i].parent_ID
					});
					for(var j in post[i].viewed)
					{
						if(req.params.userID==post[i].viewed[j])
						{
							doc[docs.length-1].viewed=true;
							break;
						}
					}
				}
                console.log('Children: '+docs);
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
app.get('/getPosts/:course_code/:userID',function(req,res,next){
    if(req.params.course_code&&req.params.userID)
    {
        Posts.find({"level_number":0,"course_code":req.params.course_code},['_id','heading','level_number'],{sort:{"timestamp":-1}},function(err,doc){
            var docs=[];
            if(doc)
            {
                // _.forEach(doc,function(u){
                //     docs.push({
                //         postID:u._id,
                //         heading:u.heading,
					// 	viewed:false
                //     });
					// for(var i in u.viewed)
					// {
					// 	if(req.params.userID==u.viewed[i])
					// 	{
					// 		docs[docs.length-1].viewed=true;
					// 	}
					// }
                // });
				docs.push(doc.length);
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
});

/**
 * @params req.params.postID The post's ID
 * @todo This function will fetch all the siblings of the post in question.
 * @return A JSON object will be returned. If successful then every index of the array will contain a JSON object. A boolean field will be there to indicate if the process was successful.
 */
app.get('/getSiblings/:postID/:userID',function(req,res,next){
    if(req.params.postID&&req.params.userID)
    {
    	console.log("/getSiblings");
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
                
                Posts.find({"level_number":0,"course_code":child.course_code},['heading','_id','level_number','viewed','timestamp','student_number'],{skip:0,limit:10,sort:{"timestamp":-1}},function(err,doc){
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
					else if(doc.length)
					{
						_.forEach(doc,function(u){
							docs.push({
								heading:u.heading,
								postID:u._id,
								viewed:false,
								userID:u.student_number,
								timestamp:u.timestamp
							});
							for(var i in u.viewed)
							{
								if(u.viewed[i]==req.params.userID)
								{
									docs[docs.length-1].viewed=true;
									break;
								}
							}
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
							"status":true,
							"text":"could not find any documents"
						});
					}
				});
            }
            else
            {
	            Posts.find({parent_ID:mongoose.Types.ObjectId(child.parent_ID)},['heading','_id','level_number','student_number','timestamp'],{skip:0,limit:10,sort:{"timestamp":-1}},function(err,par){
	                if(err)
	                {
	                    console.log(err);
	                    return res.status(200).json({
	                        status:false,
	                        text:err,
	                        data:[]
	                    });
	                }
	                if(!par.length)
	                {
	                    console.log("Cannot find parent post");
	                    return res.status(200).json({
	                        status:false,
	                        text:"Cannot find parent post",
	                        data:[]
	                    });
	                }
	                var docs=[];
	                _.forEach(par,function(u){
	                    docs.push({
	                        heading:u.heading,
	                        postID:u._id,
	                        userID:u.student_number,
	                        timestamp:u.timestamp,
							viewed:false
	                    });
						for(var i in u.viewed)
						{
							if(u.viewed[i]==req.params.userID)
							{
								docs[docs.length-1].viewed=true;
								break;
							}
						}
	                });
	                console.log("Found siblings");
	                return res.status(200).json({
	                    status:true,
	                    text:"Found siblings",
	                    data:docs
	                });
	            
            	});
	        }
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
				var st=true;
                console.log('Found the post');
				for(var i=0;i<post.viewed.length;i++)
				{
					if(post.viewed[i]==req.body.userID)
					{
						st=false;
						break;
					}
				}
				if(st==true)
				{
					post.viewed.push(req.body.userID);
				}
				post.save(function(err,post){
					if(err)
					{
						console.log("Error: "+err);
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
					console.log("Saved");
					return res.status(200).json({
						"status":true,
						"content":post.content,
						"text":"Found the post",
						"timestamp":post.timestamp.toLocaleString('en-GB'),
						"studentID":post.student_number,
						"heading":post.heading,
						"tag_list":post.tag_list
					});
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
 * @params req.params.student_number The user's student number.
 * @params req.params.course_code The module's code.
 * @todo All the posts made by the user, in a specific module, will be found and sorted out in a descending order, based on the date of creation. They will then be returned in an array of JSON objects.
 * @return A JSON object will be returned. If successful then every index of the array will contain a JSON object.
 */
app.get("/getUserPosts/:student_number/:course_code",function(req,res,next){
    if(req.params.student_number&&req.params.course_code)
    {
        Posts.find({course_code:req.params.course_code,student_number:req.params.student_number},['_id','content','level_number','student_number'],{sort:{timestamp:-1}},function(err,results){
            if(err)
            {
                console.log(err);
                return res.status(200).json({
                    status:false,
                    data:[],
                    text:err
                });
            }
            if(!results.length)
            {
                console.log("Did not find anything");
                return res.status(200).json({
                    status:true,
                    data:[],
                    text:"Did not find anything"
                });
            }
            else
            {
                console.log("Found: "+results);
                var docs=[];
                for(var i in results)
                {
                    docs.push({
                        postID:results[i]._id,
                        message:results[i].content,
                        level:results[i].level_number,
                        stn:results[i].student_number
                    });
                }
                return res.status(200).json({
                    status:true,
                    data:docs,
                    text:"Results found"
                });
            }
        });
    }
    else
    {
        console.log("Missing parameters");
        return res.status(200).json({
            status:false,
            data:[],
            text:"Missing parameters"
        });
    }
});

/**
 * @params req.params.postID The post's ID
 * @todo This function will fetch the userID of the person who made the post
 * @return A JSON object will be returned. If successful then every index of the array will contain a JSON object. A boolean field will be there to indicate if the process was successful.
 */
app.get('/getUserIDforPost/:postID', function(req, res, next) {
    console.log("/getUserIDforPost/:postID");

    Posts.findById(req.params.postID, function(err, doc) {
        if(err) {
            console.log("An error occured while searching");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching",
                "data": []
            });
        }

        else if(doc.length == 0) {
            console.log("No documents were found");
            return res.status(200).json({
                "status": false,
                "text": "No documents were found",
                "data": []
            });
        }

        else {
            console.log("Found user - Returning user information");
            return res.status(200).json({
                "status": true,
                "text": "Found user - Returning user information",
                "data": doc.student_number
            });
        }
    })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Users*/

/**
 * @params req.body.userID The user's student number.
 * @params req.body.password The user's
*  @params req.body
 * @todo Add user to LDAP
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
/*app.post('/addUser', function(req, res, next) {
	console.log('/addUser');
	
	file.addUser(function(msg)  {
		console.log(msg)
		return res.status(200).json("Done");
	});
});*/

/**
 * @params req.body.userID The user's student number.
 * @params req.body.password The user's password
 * @todo This will query local db to authenticate user
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.post('/login', function(req, res, next) {
	console.log('/login');
	
	Users.findOne({"userID": req.body.userID, "password": req.body.password}, function(err, doc) {
		if(err) {
			console.log("An error occured while searching");
			return res.status(200).json({
				"status": false, 
				"text": "An error occured while searching", 
				"data": []
			});
		}

		else if(!doc) {
			console.log("No user was found in the db");
			return res.status(200).json({
				"status": false, 
				"text": "No user was found in the db", 
				"data": []
			});
		}

		else {
			console.log("User found in db");
			return res.status(200).json({
				"status": true, 
				"text": "User found in db", 
				"data": doc
			});
		}
	});
});

/**
 * @params req.body.userID The user's student number.
 * @params req.body.password The user's
 * @todo This will query ldap and add the user to the DB
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.post('/userLogin', function(req, res, next) {
    console.log('/userLogin');

    var loginDetails = {
        userID: req.body.userID,
        password: req.body.password
    }

    file.validateUser(loginDetails, function(msg) {
        if(msg === " ") {
            return res.status(200).json({
                "status": false,
                "text": "No user with userID= " + req.body.userID + " found in LDAP",
                "data": []
            });
        }

        else {
            console.log('return: ' + msg);
            var fromLdap = JSON.parse(msg);

            //Query local DB to check if user exists
            var user = req.body.userID;

            file.getModules(loginDetails, function(userModules) {

                console.log("Modules: " + userModules);
                var toCSStatus = {
                    userID: req.body.userID,
                    modules: userModules
                }

                console.log("Populating csStatus");
                popCS(toCSStatus);

                var saveModules = [];

                for(var i in userModules) {
                    if(userModules[i] != null) {
                        saveModules.push(userModules[i].split("_")[1]);
                    }
                }

                Users.findOne({'userID': user}, function(err, doc) {
                    if(err) {
                        return res.status(200).json({
                            "status": false,
                            "text": "An error has occured while searching",
                            "data": []
                        });
                    }

                    else if(!doc) { //User doesn't exist - Add user
                        console.log('User not in db - Adding new user');

                        var newUser = new Users({
                            userID: fromLdap.userID,
                            title: fromLdap.title,
                            initials: fromLdap.initials,
                            name: fromLdap.name,
                            surname: fromLdap.surname,
                            email: fromLdap.email,
                            modules: saveModules,
                            groupsJoinedTo: [],
                            pseodoname: "not assigned",
                            photo: "none"
                        });

                        newUser.save(function(err, users) {
                            if(err) {
                                return res.status(200).json({
                                    "status": false,
                                    "text": "An error has occured while saving",
                                    "data": []
                                });
                            }

                            else if(!users) {
                                console.log('User not added');
                                return res.status(200).json({
                                    "status": false,
                                    "text": "No user was found",
                                    "data": []
                                });
                            }

                            else {
                                console.log(users);
                                return res.status(200).json({
                                    "status": false,
                                    "text": users.userID + " has been saved to the db",
                                    "data": users
                                });
                            }
                        });
                    }

                    else { //User already exists in our db
                        console.log('User already exists');
                        return res.status(200).json({
                            "status": true,
                            "text": doc.userID + " details",
                            "data": doc
                        });
                    }
                });
            })
        }
    });
});

/**
 * @todo This will display all the users in the db
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/display', function(req, res, next) {
    console.log('/display');

    Users.find(function(err, users) {
        if(err) {
            console.log("An error has occured");
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!users) {
            console.log("No users found");
            return res.status(200).json({
                "status": false,
                "text": "No users found",
                "data": []
            });
        }

        else {
            console.log("User found");
            return res.status(200).json({
                "status": true,
                "text": "Successfully found all users",
                "data": users
            });
        }
    });
});

/**
 * @params req.body.userID The user's student number.
 * @todo This will search the db for a specific user
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/getUser/:userID', function(req, res, next) {
    console.log('/getUser/userID get');
    var user = req.params.userID;
    console.log('UserID = ' + user);
    Users.find({$or: [{'userID': user}, {'pseodoname': user}]}, function(err, doc) {
        if(err) {
            console.log("An error occured");
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!doc) {
            console.log('User not found');
            return res.status(200).json({
                "status": false,
                "text": "User not found",
                "data": []
            });
        }
        else {
            console.log(doc);
            return res.json(doc).status(200);
        }
    });
});

/**
 * @params req.body.userID The user's student number.
 * @params req.body.pseodoname The user's pseodoname..
 * @todo This will remove user from db
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.delete('/deleteUser', function(req, res, next) {
    console.log('/deleteUser');

    var user = req.body.userID;
    var pseo = req.body.pseodoname;
    Users.findOneAndRemove({$or: [{'userID': user}, {'pseodoname': pseo}]}, function(err, doc) {
        if(err) {
            console.log("An error occured");
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!doc) {
            console.log("Could not find user");
            return res.status(200).json({
                "status": false,
                "text": "Could not find user",
                "data": []
            });
        }

        else {
            console.log(doc);
            return res.status(200).json({
                "status": true,
                "text": "Successfully removed user from the db",
            });
        }
    });
});

/**
 * @params req.body.userID The user's student number. or pseodoname
 * @todo This will return basic user information
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/getBasicUserInfo/:userID', function(req, res, next) {
    console.log('/getBasicUserInfo');

    var user = req.params.userID;

    Users.findOne({$or: [{'userID':user}, {'pseodoname': user}]}, function(err, doc) {
        if(err) {
            console.log('An error occured while searching');
            return res.status(200).json({
                "status": false,
                "text":err,
                "data": []
            });
        }

        else if(!doc) {
            console.log('Failed to find document');
            return res.status(200).json({
                "status": false,
                "text": "Failed to find document",
                "data": []
            });
        }

        else {
            console.log(doc);
            return res.status(200).json({
                "status": true,
                "text": "Successfully found user",
                "title": doc.title,
                "initials": doc.initials,
                "name": doc.name,
                "surname": doc.surname,
                "pseodoname": doc.pseodoname
            });
        }
    });
});

/**
 * @params req.body.userID The user's student number. or pseodoname
 * @todo This will return the groups a user has joined
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/groupsJoined/:userID', function(req, res, next) {
    console.log('/groupsJoined/:userI');

    var userID = req.params.userID;

    Users.findOne({$or: [{'userID': userID}, {'pseodoname': userID}]}, function(err, doc) {
        if(err) {
            console.log('An error occured while searching');
            return res.status(200).json({
                "status": false,
                "text":err,
                "data": []
            });
        }

        else if(!doc) {
            console.log('Failed to find document');
            return res.status(200).json({
                "status": false,
                "text": "Failed to find document",
                "data": []
            });
        }

        else {
            console.log(doc.email);
            return res.status(200).json({
                "status": true,
                "text": "Successfully found user",
                "userID": doc.userID,
                "groups": doc.groupsJoinedTo
            });
        }
    });
});

/**
 * @params req.body.userID The user's student number
 * @params req.body.pseodoname The user's pseodoname
 * @params req.body.email user's email for notification
 * @todo Updates the user information and saves to db
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.patch('/updateUserInfo', function(req, res, next) {
    console.log('/updateUserInfo');

    var user = req.body.userID;

    findOne({"userID": user}, function(err, doc) {
        if(err) {
            console.log('An error occured while searching');
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching",
                "data": []
            });
        }

        else if(!doc) {
            console.log('User not found');
            return res.status(200).json({
                "status": false,
                "text": "User not found in db",
                "data": []
            });
        }

        else {
            console.log('User found - updating details');

            doc.pseodoname = req.body.pseodoname || doc.pseodoname;
            doc.email = req.body.email || doc.email;

            findOne({"psoedoname": req.body.pseodoname}, function(err, doc) {
                if(err) {
                    console.log("An error occured");
                    return res.status(200).json({
                        "status": false,
                        "text": "An error occured while searching",
                        "data": []
                    });
                }

                else if(!doc) {
                    console.log("Pseodoname unique");
                    doc.save(function(err, obj) {
                        if(err) {
                            console.log("An error occured while saving");
                            return res.status(200).json({
                                "status": false,
                                "text": "An error occured while saving",
                                "data": []
                            });
                        }

                        else if(!obj) {
                            console.log("Could not save document");
                            return res.status(200).json({
                                "status": false,
                                "text": "Could not save updated user infomation",
                                "data": []
                            });
                        }

                        else {
                            console.log("User information has been updated");
                            return res.status(200).json({
                                "status": true,
                                "text": obj.userID + " details has been updated",
                                "data": obj
                            });
                        }
                    });
                }

                else {
                    console.log("Pseodoname already taken");
                    return res.status(200).json({
                        "status": false,
                        "text": "Pseodoname already tasken",
                        "data": []
                    });
                }
            });
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Admin*/
/**
 * @params req.params.userID The userID for the admin user
 * @todo The modules the user present will searched in the db
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/adminModules/:userID', function(req, res, next) {
    console.log('/adminModules/:userID');
    Users.findOne({"userID" : req.params.userID}, function(err, doc) {
        if(err) {
            console.log("An error occured while searching");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching for " + req.params.userID,
                "data": []
            });
        }

        else if(doc.length == 0) {
            console.log("No user found");
            return res.status(200).json({
                "status": false,
                "text": "No user found with uid=" + req.params.userID,
                "data": []
            });
        }

        else {
            console.log(doc);
            return res.status(200).json({
                "status": true,
                "text": "User found - Returning modules",
                "userID": doc.userID,
                "modules" : doc.modules
            });
        }
    });
});

/**
 * @params req.params.module The course code
 * @todo Gets all the users enrolled in the module
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/studentsInModule/:module', function(req, res, next) {
    console.log("/studentsInModule/:module");

    Users.find({modules:req.params.module},["userID"],{},function(err,users){
        if(err)
        {
            console.log("Error: ");
            return res.status(200).json({
                status:false,
                text:err,
                data:[]
            });
        }
        else if(users.length)
        {
            console.log("found");
            return res.status(200).json({
                status:true,
                text:"found",
                data:users
            });
        }
        else
        {
            console.log("Nothing found");
            return res.status(200).json({
                status:false,
                text:"Nothingd found",
                data:[]
            });
        }
    });
});

///////////////////////////////////////////csStatus///////////////////////////////////////////////////////////////
/**
 * @params req.body.userID The user's student number.
 * @params req.body.courseCode The module name.
 * @params req.body.status The user status in the module.
 * @todo This will add user details to the DB
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.post('/addModules', function(req, res, next) {
    console.log('/addModules');
    var cs = new csStatus({
        userID: req.body.userID,
        courseCode: req.body.courseCode,
        status: req.body.status
    });

    cs.save(function(err, csStat) {
        if(err) {
            console.log("An error has occured")
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!csStat) {
            console.log('Document not found');
            return res.status(404).json({
                "status": false,
                "text": "Document not found",
                "data": []
            });
        }

        else {
            console.log(csStat);
            return res.status(200).json({
                "status": true,
                "text": "Successfully added user",
                "data": csStat
            });
        }
    });
});

/**
 * @params req.body.userID The user's student number.
 * @todo This will get the status of a user, for specific modules
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.get('/getUserStatus/:userID', function(req, res, next) {
    console.log('/getUserStatus/:userID');
    var id = req.params.userID;
    var data = [];

    csStatus.find({'userID': id}, function(err, doc) {
        if(err) {
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(doc.length == 0) {
            return res.status(200).json({
                "status": false,
                "text": "User not found",
                "data": []
            });
        }

        else {
            _.forEach(doc, function(user) {
                data.push({
                    userID: user.userID,
                    courseCode: user.courseCode,
                    status: user.status,
                    points: user.current_points,
                    bounty: user.current_bounty
                });
            });

            return res.status(200).json({
                "status": true,
                "text": "Successfully found user details",
                "data": data
            });
        }
    });
});

/**
 * @params req.body.userID The user's student number.
 * @params req.body.courseCode The module courseCode
 * @params req.body.status The module's new status
 * @todo This will get the status of a user, for specific modules
 * @return A JSON object will be returned. It will contain a boolean field to indicate if the process succeed. A text field describing how the process went.
 */
app.patch('/updateStatus', function(req, res, next) {
    console.log('/updateStatus');

    csStatus.findOne({$and: [{userID: req.body.userID}, { courseCode: req.body.courseCode}]}, function(err, doc) {
        if(err) {
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!doc) {
            return res.status(200).json({
                "status": false,
                "text": "Coulld not find user",
                "data": []
            });
        }

        else {
            console.log('Found');
            doc.status = req.body.status || doc.status;

            doc.save(function(err, doc) {
                if(err) {
                    console.log("An error occured while searching");
                    return res.status(200).json({
                        "status": false,
                        "text": err,
                        "data": []
                    });
                }

                else if(!doc) {
                    console.log("Could not find user");
                    return res.status(200).json({
                        "status": false,
                        "text": "Could not find user",
                        "data": []
                    });
                }

                else {
                    console.log(doc);
                    return res.status(200).json({
                        "status": true,
                        "text": "Successfully updated user infomation",
                        "data": doc
                    });
                }
            });
        }
    });
});

/**
 * @params req.params.status This will hold the status symbol.
 * @todo The function will search for the status symbol's information. All of the status symbol's users and the course module of the status symbol will be collected.
 * @return A JSON object will be returned. A boolean field will state if the function went well. A text field will give information about what happens in the function. A data field will contain an array of objects.
 */
app.get('/getStatusInfo/:status',function(req,res,next){
    if(req.params.status) {
        csStatusS.find({status_symbol:req.params.status},function(err,obj){
            var docs=[];

            if(err) {
                console.log("Encountered error: "+err);
                res.status(200).json({
                    "status":false,
                    "text":err,
                    "data":[]
                });
            }

            else if(obj) {
                _.forEach(obj,function(doc){
                    docs.push({
                        "studentID":doc.userID,
                        "course":doc.courseCode
                    });
                });

                if(doc.length==0) {
                    console.log("found no status");
                    res.status(200).json({
                        "status":true,
                        "data":[],
                        "text":"found no status"
                    });
                }

                else {
                    console.log("found no status");
                    res.status(200).json({
                        "status":true,
                        "data":docs,
                        "text":"found status"
                    });
                }
            }

            else {
                console.log("found no status");
                res.status(200).json({
                    "status":false,
                    "text":"found no status",
                    "data":[]
                });
            }
        });
    }

    else {
        console.log("missing parameters");
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
    if(req.params.course) {
        csStatusS.find({courseCode:req.params.course},function(err,obj){
            var docs=[];
            if(err) {
                console.log("Encountered error: "+err);
                res.status(200).json({
                    "status":false,
                    "text":err,
                    "data":[]
                });
            }

            else if(obj) {
                _.forEach(obj,function(doc){
                    docs.push({
                        "studentID":doc.userID,
                        "symbol":doc.status
                    });
                });

                if(doc.length==0) {
                    console.log("found no course module");
                    res.status(200).json({
                        "status":true,
                        "text":"found no course module",
                        "data":[]
                    });
                }

                else {
                    console.log("found course module");
                    res.status(200).json({
                        "status":true,
                        "text":"found course module",
                        "data":docs
                    });
                }
            }

            else {
                console.log("The course module was not found");
                res.status(200).json({
                    "status":false,
                    "text":"The course module was not found",
                    "data":[],
                });
            }
        });
    }

    else {
        console.log("Missing parameters");
        res.status(200).json({
            "status":false,
            "text":"missing parameters",
            "data":[]
        });
    }
});

/**
 * @param req.params.userID The user's ID.
 * @todo The function deletes the user from the database
 * @return A JSON object will be returned. A boolean field will state if the function went well. A text field will give information about what happens in the function. A data field will contain an array of objects.
 */
app.delete('/removeUserFromCS/:userID', function(req, res, next) {
    console.log("/removeUserFromCS/:userID");

    csStatus.remove({"userID": req.params.userID}, function(err, doc) {
        if(err) {
            console.log("An error occured while deleteing");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while deleteing",
                "data": []
            });
        }

        else if(doc.length == 0) {
            console.log(req.params.userID + " has no documents in the db");
            return res.status(200).json({
                "status": false,
                "text": req.params.userID + " has no documents in the db",
                "data": []
            });
        }

        else {
            console.log(req.params.userID + " has been deleted");
            return res.status(200).json({
                "status": true,
                "text": req.params.userID + " has been deleted"
            });
        }
    });
});

/**
 * @param data.userID The user's ID.
 * @param data.modules The array field with module names.
 * @todo The CS status' collection will be checked if there exists a document that is similar in nature. If the document does not exist then it is created and persisted in to the collection.
 * @return Nothing.
 */
function popCS(data){
    _.forEach(data.modules,function(doc)
    {
        if(doc!="staff")
        {
            console.log("module: "+doc.split("_")[1]);
            csStatusS.findOne({userID:data.userID,courseCode:doc.split("_")[1]},function(err,cs){
                if(err)
                    return;
                if(cs)
                {
                    if(cs.status!=doc.split("_")[0])
                    {
                        cs.current_bounty=0;
                        switch(cs.status)
                        {
                            case "stud":
                                cs.current_points=50;
                                break;
                            case "teachasst":
                                cs.current_points=150;
                                break;
                            case "lect":
                                cs.current_points=1000;
                                break;
                            case "tuts":
                                cs.current_points=300;
                                break;
                            default:
                                break;
                        }
                        cs.save(function(err,cs){});
                    }
                }
                else
                {
                    var cs=new csStatusS({
                        userID:data.userID,
                        courseCode:doc.split("_")[1],
                        status:doc.split("_")[0]
                    });
                    switch(cs.status)
                    {
                        case "stud":
                            cs.current_points=50;
                            break;
                        case "teachasst":
                            cs.current_points=150;
                            break;
                        case "lect":
                            cs.current_points=1000;
                            break;
                        case "tuts":
                            cs.current_points=300;
                            break;
                        default:
                            break;
                    }
                    cs.save(function(err,cs){
                        if(err)
                        {
                            console.log("Error: "+err);
                        }
                    });
                }
            });
        }
    });
}

/**
 * @param req.params.userID The user's ID.
 * @param req.body.bounty The bounty to be added.
 * @param req.body.point The points to be added.
 * @todo The user's CS ststus copy will be retrieved and operations will be done on their points and bounty. Either the operation will be an addition and subraction. To make a subtraction operation, the points and bounty will need to be negative.
 * @return A JSON object will be returned. A boolean field to indicate the operation status. A text field to describe the operations status. Two number fields for the points and bounty.
 */
app.patch('/changeUserCsStatus/:userID',function(req,res,next){
    if(req.params.userID&&req.body.bounty&&req.body.point)
    {
        csStatusS.findOne({userID:req.params.userID},function(err,cs){
            if(err)
            {
                console.log("Error: "+err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    bounty:-1,
                    points:-1
                });
            }
            else if(!cs)
            {
                console.log("Document not found");
                return res.status(200).json({
                    status:false,
                    text:"Document not found",
                    bounty:-1,
                    points:-1
                });
            }
            else
            {
                cs.current_points=cs.current_points+req.body.points;
                cs.current_bounty=cs.current_bounty+req.body.bounty;
                cs.save(function(err,doc){
                    if(err)
                    {
                        console.log("Error: "+err);
                        return res.status(200).json({
                            status:false,
                            text:err,
                            bounty:-1,
                            points:-1
                        });
                    }
                    else if(!doc)
                    {
                        console.log("Document failed to save");
                        return res.status(200).json({
                            status:false,
                            text:"Document failed to save",
                            bounty:-1,
                            points:-1
                        });
                    }
                    else
                    {
                        console.log("Saved document");
                        return res.status(200).json({
                            status:true,
                            text:"Saved document",
                            bounty:cs.current_bounty,
                            points:cs.current_points
                        });
                    }
                });
            }
        });
    }
    else
    {
        console.log("Missing parameters");
        return res.status(200).json({
            status:false,
            text:"Missing parameters",
            bounty:-1,
            points:-1
        });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Votes*/
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
            Votes.findOne({postID:post._id},['_id','upVotes','downVotes','course_code'],function(err,vote){
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
                    console.log("Didn't find the vote");
                    var v=new Votes({
                        postID:post._id,
						course_code:post.course_code,
                        upVotes:[req.body.student_number],
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
                        console.log("Successfully persisted to the db: "+vote);
                        return res.status(200).json({
                            status:true,
                            text:"Successfully up voted"
                        });

                    });
                }
                else
                {
                    console.log("Found vote: "+vote);
                    for(var i in vote.downVotes){
                        if(vote.downVotes[i]==req.body.student_number)
                        {
                            console.log("User already down voted this post");
                            return res.status(200).json({
                                status:false,
                                text:"User already down voted this post"
                            });
                        }
                    }

                    var done=0;
                    for (var i in vote.upVotes)
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
                        console.log("Not yet up voted");
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
                        console.log("Already up voted");
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
            status:false,
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
            Votes.findOne({postID:post._id},['_id','upVotes','downVotes','course_code'],function(err,vote){
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
                    console.log("Didn't find the vote");
                    var v=new Votes({
                        postID:post._id,
						course_code:post.course_code,
                        downVotes:[req.body.student_number],
                        upVotes:[]
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
                        console.log("Successfully persisted to the db: "+vote);
                        return res.status(200).json({
                            status:true,
                            text:"Successfully up voted"
                        });

                    });
                }
                else
                {
                    console.log("Found vote: "+vote);
                    for(var i in vote.upVotes){
                        if(vote.upVotes[i]==req.body.student_number)
                        {
                            console.log("User already up voted this post");
                            return res.status(200).json({
                                status:false,
                                text:"User already up voted this post"
                            });
                        }
                    }

                    var done=0;
                    for (var i in vote.downVotes)
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
                        console.log("Not yet down voted");
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
                        console.log("Already down voted");
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
            status:false,
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
            Votes.findOne({postID:post._id},function(err,vote){
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
                else
                {
                    console.log("Successfully found vote: "+vote);
                    return res.status(200).json({
                        status:true,
                        num:vote.upVotes.length,
                        text:"Successfully found votes"
                    });
                }
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
            Votes.findOne({postID:post._id},function(err,vote){
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
                else
                {
                    console.log("Successfully found vote: "+vote);
                    return res.status(200).json({
                        status:true,
                        num:vote.downVotes.length,
                        text:"Successfully found votes"
                    });
                }
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

app.get('/pop',function(req,res,next){
    Posts.find({},['_id'],function(err,posts){
        if(err) {
            console.log(err);
            res.status(200).send(err);
        }
        else {
            console.log(posts + " this is what was found " + err);
            _.forEach(posts, function (post) {
                var vote = new Votes({
                    postID: post._id,
                    upVotes: [],
                    downVotes: []
                });
                vote.save(function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("done popping");
                });
            });
            res.status(200).send("done");
        }
    });

});
app.get('/popR',function(req,res,next){
    Votes.find({},function(err,posts){
        _.forEach(posts,function (post) {
            post.remove(function(err){});
        });
    });
    return res.status(200).send("done");
});
/**
 * @params req.params.postID The ID of the level-0 post.
 * @todo The post's ID will be used to find said post. Once found, the entire structure of the post (including it's successsors) will be traversed. All the responses of the post will be summed up.
 * @return A JSON object will be returned. It will contain a boolean field to indicate whether or not the operation was successful. A text field to report on the operation. An integer field which will state the number of replies found.
 */
app.get("/getPostReplies/:postID",function(req,res,next){
    if(req.params.postID)
    {
        Posts.findOne({_id:req.params.postID,level_number:0},function(err,doc){
            if(err)
            {
                console.log(err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    num:-1
                });
            }
            else if(!doc)
            {
                console.log("Document not found");
                return res.status(200).json({
                    status:false,
                    text:"Document not found",
                    num:-1
                });
            }
            else
            {
                console.log("Document found");
                var numberOfReplies=doc.child_list.length;
                for(var i in doc.child_list)
                {
                    countReplies(doc.child_list[i],function(num){
                        if(num>0)
                            numberOfReplies+=num;
                    });
                }
                console.log("Total replies: "+numberOfReplies);
                return res.status(200).json({
                    status:true,
                    text:"Document found. Replies counted",
                    num:numberOfReplies
                });
            }
        });
    }
    else
    {
        return res.status(200).json({
            status:false,
            text:"Missing parameters",
            num:-1
        });
    }
});
/**
 * @params postObject The JSON object from a post's child list.
 * @params callBack The call back function.
 * @todo Once the post is found, it will have all its successor posts counted and then sent, as a parameter, to the call back function. After that it will recursively call itself until it does not find a post with a successor post.
 * @return None
 */
function countReplies(postObject,callBack){
    Posts.findById(postObject.postID,function(err,doc){
        if(err)
        {
            console.log(err);
            return;
        }
        else if(doc)
        {
            callBack(doc.child_list.length);
            for(var i in doc.child_list)
            {
                countReplies(doc.child_list[i]);
            }
        }
    });
}

/**
 * @param req.params.student_number The user's ID.
 * @todo The user's status information will be found and collected.
 * @return A JSON object will be returned. A boolean field will indicate how the operation went. A text field will specify how the operation went. A number field will then hold the number of points the user currently has.
 */
app.get('/getUserPoints/:student_number',function(req,res,next){
    if(req.params.student_number)
    {
        csStatusS.findOne({userID:req.params.student_number},function(err,cs){
            if(err)
            {
                console.log("Error: "+err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    num:-1
                });
            }
            else if(cs)
            {
                console.log("Found document");
                return res.status(200).json({
                    status:true,
                    text:"Found document",
                    points:cs.current_points,
                    bounty:cs.current_points,
                    csStatus:cs.status
                });
            }
            else
            {
                console.log("Document not found");
                return res.status(200).json({
                    status:false,
                    text:"Document not found",
                    points: -1,
                    bounty: -1,
                    csStatus:null
                });
            }
        });
    }
    else
    {
        console.log("Missing parameters");
        return res.status(200).json({
            status:false,
            text:"Missing parameters",
            points:-1
        });
    }
});

/**
 * @params req.params.student_number The user's student number.
 * @params req.params.course_code The module's code.
 * @todo All the posts made by the user, in a specific module, will be found and sorted out in a descending order, based on the date of creation. They will then be returned in an array of JSON objects.
 * @return A JSON object will be returned. If successful then every index of the array will contain a JSON object.
 */
app.get("/getUserPosts/:student_number/:course_code",function(req,res,next){
    if(req.params.student_number&&req.params.course_code)
    {
        Posts.find({course_code:req.params.course_code,student_number:req.params.student_number},['_id','content','level_number','student_number'],{sort:{timestamp:-1}},function(err,results){
            if(err)
            {
                console.log(err);
                return res.status(200).json({
                    status:false,
                    data:[],
                    text:err
                });
            }
            if(!results.length)
            {
                console.log("Did not find anything");
                return res.status(200).json({
                    status:true,
                    data:[],
                    text:"Did not find anything"
                });
            }
            else
            {
                console.log("Found: "+results);
                var docs=[];
                for(var i in results)
                {
                    docs.push({
                        postID:results[i]._id,
                        message:results[i].content,
                        level:results[i].level_number,
                        stn:results[i].student_number
                    });
                }
                return res.status(200).json({
                    status:true,
                    data:docs,
                    text:"Results found"
                });
            }
        });
    }
    else
    {
        console.log("Missing parameters");
        return res.status(200).json({
            status:false,
            data:[],
            text:"Missing parameters"
        });
    }
});

/**
 * @params postObject The JSON object from a post's child list.
 * @params callBack The call back function.
 * @todo Once the post is found, it will have all its successor posts counted and then sent, as a parameter, to the call back function. After that it will recursively call itself until it does not find a post with a successor post.
 * @return None
 */
function countReplies(postObject,callBack){
    Posts.findById(postObject.postID,function(err,doc){
        if(err)
        {
            console.log(err);
            return;
        }
        else if(doc)
        {
            callBack(doc.child_list.length);
            for(var i in doc.child_list)
            {
                countReplies(doc.child_list[i]);
            }
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Group Chat*/
/**
 *@params req.body.groupName Group name
 *@params req.body.initiator Person who created the group
 *@params req.body.peers People in the group
 *@todo A group will be created and updates user record with group name
 *@return A json object will be returned with group information, if successful
 */
app.post('/createGroup', function(req, res, next) {
    console.log('/createGroup');

    groupChat.findOne({'groupName': req.body.groupName}, function(err, doc) {
        if(err) {
            console.log('An error occured will searching.');
            res.status(200);
            return res.json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!doc) {
            console.log('No group with current group name.');
            var someDate = new Date();
            var numberDaysToAdd = 7;
            someDate.setDate(someDate.getDate() + numberDaysToAdd);
            var group = new groupChat({
                initiator: req.body.initiator,
                groupName: req.body.groupName,
                expiry_date: someDate,
                peers: []
            });

            if(req.body.peers != null && req.body.peers.length == 0) {
                console.log("No peers added");
            }

            else {
                for(var i in req.body.peers) {
                    group.peers.push(req.body.peers[i]);
                }
            }

            group.peers.push(req.body.initiator); //Added

            group.save(function(err, obj) {
                if(err) {
                    console.log('An error occured will searching.');
                    return res.status(200).json({
                        "status": false,
                        "text": err,
                        "data": []
                    });
                }

                else if(!obj) {
                    console.log('Failed to save document.');
                    return res.status(200).json({
                        "status": false,
                        "text": "Could not save document",
                        "data": [],
                    });
                }

                else {
                    console.log('Group ' + obj.groupName + ' created - App participants');
                    console.log(obj.peers);
                }
            });

            if(req.body.peers != null && req.body.peers.length != 0) {

                _.forEach(req.body.peers, function(user) {
                    Users.findOne({$or: [{"userID": user}, {"pseodoname": user}]}, function(err, doc) {
                        if(err) {
                            console.log("Error occured while locating user");
                            return;
                        }

                        else if(!doc) {
                            console.log("User not found");
                            return;
                        }

                        else {
                            console.log(req.body.groupName);
                            doc.groupsJoinedTo.push(req.body.groupName)

                            doc.save(function(err, obj) {
                                if(err) {
                                    console.log("An error occured while saving");
                                    return;
                                }

                                else if(!obj){
                                    console.log("Could not save document");
                                    return;
                                }

                                else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                });
            }

            Users.findOne({"userID": req.body.initiator}, function(err, doc) {
                if(err) {
                    console.log("An error occured while searching");
                    return;
                }

                else if(!doc) {
                    console.log(req.body.initiator + " not found in db");
                    return;
                }

                else {
                    console.log(req.body.initiator + " has been found");
                    doc.groupsJoinedTo.push(req.body.groupName)

                    doc.save(function(err, obj) {
                        if(err) {
                            console.log("An error occured while saving");
                            return;
                        }

                        else if(!obj){
                            console.log("Could not save document");
                            return;
                        }

                        else {
                            console.log(doc);
                            return;
                        }
                    });
                    return;
                }
            });

            res.status(200).json({
                "status": true,
                "text": "Created group",
                "groupName" : req.body.groupName,
                "peers" : req.body.peers
            });
        }

        else if(doc) {
            console.log('Group with name already exists, choose a differe name');
            return res.status(200).json({
                "status":200,
                "text":"Choose a different group name"
            });
        }
    });
});

/**
 * @todo Generates list of all groups created in the system
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.get('/getAllGroups', function(req, res, next) {
    console.log('/getAllGroups');

    groupChat.find({}, function(err, doc) {
        if(err) {
            console.log('An error occured while searching');
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!doc) {
            console.log('Failed to find documents');
            return res.status(200).json({
                "status": false,
                "text": "No documents found",
                "data": []
            });
        }

        else {
            console.log('Documents found');
            var data = [];

            _.forEach(doc, function(obj) {
                data.push({
                    initiator: obj.initiator,
                    groupName: obj.groupName,
                    peers: obj.peers
                });
            });

            console.log(data);
            return res.status(200).json({
                "status": true,
                "Text": " found all documents",
                "data": data
            });
        }
    });
});


/**
* @params req.body.groupName The groups's name.
* @params req.body.peers The array of peers to join the group.
* @todo Join an already created group
* @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
*/
app.patch('/joinGroup', function(req, res, next) {
	console.log('/joinGroup');

	groupChat.findOne({'groupName':req.body.groupName}, function(err, doc) {
		if(err) {
			console.log('An error occured while searching');
			return res.status(200).json({
				"text":err, 
				"status": "false", 
				"data": []
			});
		}

		else if(!doc.length == 0) {
			console.log('Failed to find documents');
			return res.status(200).json({
				"status": "false",
				"text": "No documents found", 
				"data": []
			});
		}

		else {
            if(req.body.peers.length == 0) {
                console.log("No users in request body");
                return res.status(200).json({
                    "status": false, 
                    "text": "No users in request body", 
                    "data": []
                });
            }

            else if(req.body.peers.length == 1) {
                var status = false;

                for(var t in doc.peers) {
                    if(doc.peers[t] == req.body.peers) {
                        status = true;
                        break;
                    }        
                }
                

                if(status == false) {
                    doc.peers.push(req.body.peers);

                    doc.save(function(err, obj) {
                        if(err) {
                            console.log("An error occured while saving");
                        }

                        else if(obj.length == 0) {
                            console.log("Could not save document");
                        }

                        else {
                            console.log("User added to the group");
                        }
                    });

                    Users.findOne({"userID": req.body.peers}, function(err, doc) {
                        if(err) {
                            console.log("An error occured while searching for a user");
                            return res.status(200).json({
                                "status": false, 
                                "text": "An error occured while searching for a user", 
                                "data": []
                            });
                        }

                        else if(doc) {
                            console.log("No user was found");
                            return res.status(200).json({
                                "status": false, 
                                "text": "No user was found",
                                "data": []
                            });
                        }

                        else {
                            console.log("Adding user to groups joined");
                            doc.groupsJoinedTo.push(doc.userID);

                            doc.save(function(err, obj) {
                                if(err) {
                                    console.log("An error occured while saving");
                                    return res.status(200).json({
                                        "status": false, 
                                        "text": "An error occured while saving", 
                                        "data": []
                                    });
                                }

                                else if(!obj) {
                                    console.log("Could not save user");
                                    return res.status(200).json({
                                        "status": false, 
                                        "text": "Could not save user", 
                                        "data": []
                                    });
                                }

                                else {
                                    console.log("Saving user");
                                    return res.status(200).json({
                                        "status": 200, 
                                        "text": "User saved in db", 
                                        "groupName": req.body.groupName
                                    })
                                }
                            })
                            return res.status(200).json({
                                "status": 200, 
                                "text": "Adding user to the group", 
                                "group": doc.groupName, 
                                "peers": doc.peers
                            });
                        }
                    });
                }

                else if(status == true){
                    console.log("User already in group");
                    return res.status(200).json({
                        "status": false, 
                        "text": "User already in group", 
                        "data": []
                    });
                }
            }

            else { //More than one peer in array passed
                var status = false;

                for(var r in doc.peers) {
                    for(var e in req.body.peers) {
                        if(doc.peers[r] == req.body.peers[e]) {
                            status = true;
                            break;
                        }
                    }

                    if(status == true)
                         break;
                }


                if(status == false) {
                    for(var i in req.body.peers) {
                        doc.peers.push(req.body.peers[i]);
                        Users.findOne({"userID": req.body.peers[i]}, function(err, user) {
                            if(err) {
                                console.log("An error occured while searching for user");
                            }

                            else if(user.length == 0) {
                                console.log("Could nit find user");
                            }

                            else {
                                user.groupsJoinedTo.push(req.body.groupName);
                                console.log("Added user to group");

                                user.save(function(err, doc) {
                                    if(err) {
                                        console.log("An error occured while saving");
                                    }

                                    else if(doc.length == 0) {
                                        console.log("Document could not be found");
                                    }

                                    else {
                                        console.log("User added to group");
                                    }
                                })
                            }
                        });
                    }

                    doc.save(function(err, obj) {
                        if(err) {
                            console.log("An error occured while saving");
                            return res.status(200).json({
                                "status": false, 
                                "text": "An error occured while saving", 
                                "data": []
                            });
                        }

                        else if(obj.length == 0) {
                            console.log("Document could not be saved");
                            return res.status(200).json({
                                "status": false,
                                "text": "Document could not be saved", 
                                "data": []
                            });
                        }

                        else {
                            console.log("Document saved");
                            return res.status(200).json({
                                "status": 200, 
                                "text": "Documents saved", 
                                "data": obj
                            });
                        }
                    });
                }

                else{
                    console.log("User already in the group");
                    return res.status(200).json({
                        "status": false, 
                        "text": "User already in the group", 
                        "data": []
                    });
                }
            }
		}
	});
})

/**
 * @params req.body.groupName The groups's name.
 * @params req.body.userID The user's userID
 * @todo Given user is removed from group
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.delete('/exitGroup', function(req, res, next) {
    console.log('/exitGroup');

    groupChat.findOne({'groupName': req.body.groupName}, function(err, doc) {
        if(err) {
            console.log('An error occured while searching');
            return res.status(200).json({
                "status": false,
                "text":err,
                "data": []
            });
        }

        else if(!doc) {
            console.log('Could not find document');
            return res.status(200).json({
                "status":false,
                "text": "Could not find document",
                "data": []
            });
        }

        else {
            console.log("Removing from peers: " + req.body.userID);
            for(var i=0;i<doc.peers.length;i++) {
                if(doc.peers[i]==req.body.userID) {
                    console.log("User: " + doc.peers[i] + " == " + req.body.userID);
                    doc.peers.splice(i,1);
                    break;
                }
            }

            doc.save(function(err, obj) {
                if(err) {
                    console.log("Error occured while saving");
                    return;
                }

                else if(!obj) {
                    console.log("Could not find document");
                    return;
                }

                else {
                    console.log(req.body.userID + " has been removed from: " + obj.groupName);
                    return;
                }
            });

            Users.findOne({$or: [{"userID": req.body.userID}, {"pseodoname": req.body.userID}]}, function(err, doc) {
                if(err) {
                    console.log("An error occured removing: " + doc.userID);
                    return res.status(200).json({
                        "status": false,
                        "text": "An error occured while saving",
                        "data": []
                    });
                }

                else if(!doc) {
                    console.log("Could not find: " + req.body.userID);
                    return res.status(200).json({
                        "status": false,
                        "text": "Could not find user",
                        "data": []
                    });
                }

                else {
                    console.log("Removing from groupsJoinedTo: " + req.body.userID);
                    for(var i=0;i<doc.groupsJoinedTo.length;i++) {
                        if(doc.groupsJoinedTo[i]==req.body.groupName) {
                            doc.groupsJoinedTo.splice(i,1);
                            break;
                        }
                    }

                    doc.save(function(err, obj) {
                        if(err) {
                            console.log("An error occured while saving");
                            return res.status(200).json({
                                "status": false,
                                "text": "An error occured while saving",
                                "data": []
                            });

                        }

                        else if(!obj) {
                            console.log("Document could not be found");
                            return res.status(200).json({
                                "status": false,
                                "text": "Document could not be found",
                                "data": []
                            });
                        }

                        else {
                            console.log(req.body.userID + " has been removed form " + req.body.groupName);
                        }
                    });
                }
            });

            return res.status(200).json({
                "status": true,
                "text": req.body.userID + " has been removed form " + req.body.groupName
            });
        }
    });
});

/**
 *@params req.body.groupName Group name
 *@params req.body.initiator Person who created the group
 *@todo A group will be removed and and all users removed
 *@return A json object will be returned with details about the operation
 */
app.delete('/removeGroup', function(req, res, next) {
    console.log('/removeGroup');

    groupChat.remove({ $and: [{'groupName': req.body.groupName}, {'initiator': req.body.initiator}]}, function(err, doc) {
        if(err) {
            console.log('An error occured');
            return res.status(200).json({
                "status": false,
                "text": "An error occured",
                "data": []
            });
        }

        else if(!doc) {
            console.log('Could not remove group');
            return res.status(200).json({
                "status": false,
                "text": "Could not delete group, check details",
                "data": []
            });
        }

        else {
            console.log('Removing participants from group');
            var data = [];
            data = doc.peers;

            _.forEach(data, function(user) {
                Users.findOne({$or: [{"userID": user}, {"pseodoname": user}]}, function(err, doc) {
                    if(err) {
                        console.log("An error occured while seaching for: " + user);
                        return res.status(200).json({
                            "status": false,
                            "text": "An error occured while searching",
                            "data": []
                        });
                    }

                    else if(!doc) {
                        console.log("Could not find user");
                        return res.status(200).json({
                            "status": false,
                            "text": user + " not found",
                            "data": []
                        });
                    }

                    else {
                        console.log('Found user - removing group from groups joined');

                        for(var i=0;i<user.groupsJoinedTo.length;i++) {
                            if(user.groupsJoined[i]==req.body.groupName) {
                                console.log("User: " + user.groupsJoinedTo[i]);
                                user.groupsJoinedTo.splice(i,1);
                                break;
                            }
                        }

                        user.save(function(err, doc) {
                            if(err) {
                                console.log("An error occured while saving");
                                return res.status(200).json({
                                    "status": false,
                                    "text": "An error occured while saving",
                                    "data": []
                                });
                            }

                            else if(!doc) {
                                console.log("Document could not be found");
                                return res.status(200).json({
                                    "status": false,
                                    "text": "Document could not be found",
                                    "data": []
                                });
                            }

                            else {
                                console.log(doc.userID + " has been removed from: " + req.body.groupName);
                            }
                        })
                    }
                });
            });

            return res.status(200).json({
                "status": true,
                "text": "Users removed and group deleted"
            });
        }
    });
});

/**
 * @params req.params.groupName The group's name
 * @todo check if group is still active and return the groups information
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation. A field will be added to store the posts ID.
 */
app.get('/getGroupInformation/:groupName', function(req, res, next) {
    console.log('/getGroupInformation');

    groupChat.findOne({'groupName': req.params.groupName}, function(err, doc) {
        if(err) {
            console.log("An error occured while searching");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching",
                "data": []
            });
        }

        else if(!doc) {
            console.log("Group not found");
            return res.status(200).json({
                "status": false,
                "text": "Group doesn't exists",
                "data": []
            });
        }

        else {
            console.log("Group found - Returning details");
            return res.status(200).json({
                "status": true,
                "text": "Group found - Returning details",
                "data": doc
            });
        }
    });
})


/**
 * @params req.body.groupID The group's ID.
 * @params req.body.student_number The user's student number.
 * @params req.body.message The message to be added.
 * @todo A message will be created and linked to the group it belongs to.
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation. A field will be added to store the posts ID.
 */
app.post("/createMessage",function(req,res,next){
    if(req.body.groupID&&req.body.student_number&&req.body.message)
    {
        Messages.find({linkToGroup:req.body.groupID},['levels'],{sort:{timestamp:-1}},function(err,arr){
            if(err)
            {
                console.log(err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    postID:null
                });
            }
            if(!arr.length)
            {
                var msg=new Messages({
                    message:req.body.message,
                    creator:req.body.student_number,
                    levels:1,
                    linkToGroup:req.body.groupID
                });
                console.log("Saving new message");
                msg.save(function(err,_msg){
                    if(err)
                    {
                        console.log(err);
                        return res.status(200).json({
                            status:false,
                            text:err,
                            postID:null
                        });
                    }
                    if(_msg)
                    {
                        console.log("Successfully saved message");
                        return res.status(200).json({
                            status:true,
                            text:"Successfully saved message",
                            postID:_msg._id
                        });
                    }
                    else
                    {
                        console.log("Something went wrong trying to save the document");
                        return res.status(200).json({
                            status:false,
                            text:"Something went wrong trying to save the document",
                            postID:null
                        });
                    }
                });
            }
            else
            {
                var doc=arr[0];
                var msg=new Messages({
                    message:req.body.message,
                    creator:req.body.student_number,
                    levels:(doc.levels+1),
                    linkToGroup:req.body.groupID
                });
                msg.save(function(err,_msg){
                    if(err)
                    {
                        console.log(err);
                        return res.status(200).json({
                            status:false,
                            text:err,
                            postID:null
                        });
                    }
                    if(_msg)
                    {
                        console.log("Successfully saved message");
                        return res.status(200).json({
                            status:true,
                            text:"Successfully saved message",
                            postID:_msg._id
                        });
                    }
                    else
                    {
                        console.log("Something went wrong trying to save the document");
                        return res.status(200).json({
                            status:false,
                            text:"Something went wrong trying to save the document",
                            postID:null
                        });
                    }
                });
            }
        });
    }
    else
    {
        console.log("Missing parameters");
        return res.status(200).json({
            status:false,
            postID:null,
            text:"Missing parameters"
        });
    }
});
/**
 * @params req.params.groupID The group's ID.
 * @todo All the messages belonging to the group will be found and sorted out in descending order, according to their timestamp.
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation. An array field will be added to store all the messages found.
 */
app.get("/getGroupMessages/:groupID",function(req,res,next){
    if(req.params.groupID)
    {
        Messages.find({linkToGroup:req.params.groupID},['message','creator','timestamp'],{sort:{timestamp:1}},function(err,results){
            if(err)
            {
                console.log(err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    data:[]
                });
            }
            else if(!results.length)
            {
                console.log("Did not find any messages for the group");
                return res.status(200).json({
                    status:true,
                    text:"Did not find any messages for the group",
                    data:[]
                });
            }
            else
            {
                console.log("Found the messages");
                return res.status(200).json({
                    status:true,
                    text:"Found the messages",
                    data:results
                });
            }
        });
    }
    else
    {
        console.log("Missing parameters");
        return res.status(200).json({
            status:false,
            text:"Missing parameters" ,
            data:[]
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Subscribed posts*/

/**
 * @params req.body.userID The users userID.
 * @params req.body.postID The postID.
 * @todo Subscribed post will be added to DB
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.post('/addToList', function(req, res, next) {
    console.log('Adding post to subscribed list');

    var sp = new SubThreads({
        userID: req.body.userID,
        postID: req.body.postID
    });

    sp.save(function(err, obj) {
        if(err) {
            console.log('Error ' + err);
            return res.status(200).json({
                "status": "false",
                "text": err
            });
        }

        else if(!obj) {
            console.log('Document not found');
            return res.status(200).json({
                "status": "false",
                "text": "Document not found"
            });
        }

        else {
            Posts.findById(req.body.postID, function(err, doc) {
                if(err) {
                    console.log("An error occured while searching");
                    return res.status(200).json({
                        "status": "false",
                        "text": err,
                        "data": []
                    });
                }

                else if(!doc) {
                    console.log("Could not find post");
                    return res.status(200).json({
                        "status": "false",
                        "text": "Could not find document",
                        "data": []
                    });
                }

                else {
                    console.log(doc);
                    return res.status(200).json({
                        "status": true,
                        "text": "successfully found post",
                        "data": doc
                    });
                }

            });
        }
    });
});

/**
 * @params req.body.userID The users userID.
 * @params req.body.postID The postID.
 * @todo Subscribed post will be removed from DB
 * @return A JSON object will be returned. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.delete('/removeFromList', function(req, res, next) {
    console.log('/removeFromList');
    var user = req.body.userID;
    var post = req.body.postID;
    SubThreads.findOneAndRemove({$and: [{'userID': user}, {'postID': post}]}, function(err, obj) {
        if(err) {
            console.log('Error: ' + err);
            return res.status(200).json({
                "status": false,
                "text": err,
                "data": []
            });
        }

        else if(!obj) {
            console.log('Document not found');
            return res.status(404).json({
                "status": false,
                "text": "Document not found",
                "data": []
            });
        }

        else {
            console.log(obj);
            return res.status(200).json({
                "status": true,
                "text": user + " has been deleted",
                "data": obj
            });
        }
    });
});

/**
 * @params req.body.userID The users userID.
 * @todo Returns posts user subscribed to.
 * @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.get('/getSubList/:userID', function(req, res, next) {
    var user = req.params.userID;
    console.log('Find user: ' + user);

    SubThreads.find({'userID': user}, function(err, obj) {
        if(err) {
            console.log('Error: ' + err);
            res.status(200).json({
                "status": "false",
                "text": err,
                "data": []
            });
        }

        else if(!obj) {
            console.log('Document not found');
            res.status(200).json({
                "status": "false",
                "text": "Documents not found",
                "data": []
            });
        }

        else { //Fix async call
            console.log(obj);
            var data = [];
            for(var i in obj) {
                Posts.findById(obj[i].postID, function(err, doc) {
                    if(err) {
                        console.log("An error has occured");
                        return;
                    }

                    else if(!doc) {
                        console.log("Could not find document " + post.postID);
                        return;
                    }

                    else {
                        console.log("Found doc " + doc);
                        data.push(doc);
                    }
                });
            };

            console.log("Returning " + data + " has been sent");
            return res.status(200).json({
                "status": true,
                "text" : "successfully found all posts",
                "data": data
            });
        }
    });
});

//////////////////////////////////////////////////////////////////////////////////
/*Milestones*/
/**
 * @params req.body.milestoneName The users userID.
 * @params req.body.description The description of the milestone
 * @params req.body.reward The reward for the milestone
 * @params req.body.data The expiry dayta
 * @todo Returns posts user subscribed to.
 * @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.post('/createMilestone', function(req, res, next) {
    console.log('/createMilestone');

    milestone.findOne({'milestoneName': req.body.milestoneName}, function(err, doc) {
        if(err) {
            console.log("An error occured");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching",
                "data": []
            });
        }

        else if(!doc) {
            console.log("Milestone name unique - creating milestone");
            var someDate = new Date();
            var numberDaysToAdd = 7;
            someDate.setDate(someDate.getDate() + numberDaysToAdd);

            var newMile = new milestone({
                milestoneName: req.body.milestoneName,
                description: req.body.description,
                usersCompletedMilestone: [],
                reward: req.body.reward,
                expiry_date: req.body.data || someDate
            });

            newMile.save(function(err, doc) {
                if(err) {
                    console.log("An error occured while saving");
                    return res.status(200).json({
                        "status": false,
                        "text": "An error occured while saving",
                        "data": []
                    });
                }

                else if(!doc) {
                    console.log("Document could not be saved");
                    return res.status(200).json({
                        "status": false,
                        "text": "Document could not be saved",
                        "data": []
                    });
                }

                else {
                    console.log("Document saved");
                    return res.status(200).json({
                        "status": true,
                        "text": "Milestone created",
                        "data": doc
                    });
                }
            });
        }

        else {
            console.log("Milestone name already exists");
            return res.status(200).json({
                "status": false,
                "text": "Milestone name already exists",
                "data": []
            });
        }
    })
});

/**
 * @params req.body.milestoneName The users userID.
 * @params req.body.usersCompletedMilestone The user that completed milestone
 * @todo Add userID to list after they complete a milestone.
 * @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.post('/rewardUser', function(req, res, nexr) {
    milestone.findOne({'milestoneName': req.body.milestoneName}, function(err, doc) {
        if(err) {
            console.log("An error occured while searching");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching",
                "data": []
            });
        }

        else if(!doc) {
            console.log("Document not found");
            return res.status(200).json({
                "status": false,
                "text": "Document cannot be found",
                "data": []
            });
        }

        else {
            console.log("Added userID to list");

            doc.usersCompletedMilestone.push(req.body.usersCompletedMilestone);

            doc.save(function(err, obj) {
                if(err) {
                    console.log("An error occured while saving");
                    return res.status(200).json({
                        "status": false,
                        "text": "An error occured while saving",
                        "data": []
                    });
                }

                else if(!obj) {
                    console.log("Document not added");
                    return res.status(200).json({
                        "status": false,
                        "text": "Document not saved",
                        "data": []
                    });
                }

                else {
                    console.log(obj.usersCompletedMilestone + " rewarded");
                    return res.status(200).json({
                        "status": true,
                        "text": obj.usersCompletedMilestone + " rewarded",
                        "data": obj
                    });
                }
            });
        }
    });
});

/**
 * @todo Return all the milestones.
 * @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
 */
app.get('/getMilestones', function(req, res, next) {
    console.log("/getMilestones");
    milestone.find({}, function(err, doc) {
        if(err) {
            console.log("An error occured while searching");
            return res.status(200).json({
                "status": false,
                "text": "An error occured while searching",
                "data": []
            });
        }

        else if(!doc.length == 0) {
            console.log("No documents were found");
            return res.status(200).json({
                "status": false,
                "text": "No documents were found",
                "data": []
            });
        }

        else {
            console.log("Returning all the documents");
            return res.status(200).json({
                "status": true,
                "text": "Returning all the milestones",
                "data": doc
            });
        }
    });
});

/**
* @todo Get a list of completed milestones
* @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
*/
app.get('/getCompletedMilestone', function(req, res, next) {
	console.log('/getCompletedMilestone');
	
	milestone.find({}, function(err, doc) {
		if(err) {
			console.log("An error occured while searching");
			return res.status(200).json({
				"status": false, 
				"text": "An error occured while searching", 
				"data":[]
			});
		}
		
		else if(doc.length == 0) {
			console.log("No milestones were found");
			return res.status(200).json({
				"status": false,
				"text": "No milestones were found", 
				"data": []
			});
		}
		
		else {
			console.log("Cheching for completed milestones");
			var data = [];
			
			for(var i in doc) {
				if(doc[i].usersCompletedMilestone.length != 0) {
					data.push(doc[i].milestoneName);
				}
			};
			
			if(data.length != 0) {
				return res.status(200).json({
					"status": false, 
					"text": "No milestones have been achieved", 
					"data": []
				});
			}
			
			else {
				return res.status(200).json({
					"status": true, 
					"text": "Milestones have been completed", 
					"data": data
				});
			}
		}
	});
});

/**
* @todo get list of uncompleted milestones
* @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
*/
app.get('/getUncompletedMilestones', function(req, res, next) {
	console.log("/getUncompletedMilestones");
	
	milestone.find({}, function(err, doc) {
		if(err) {
			console.log("An error occured while searching");
			return res.status(200).json({
				"status": false, 
				"text": "An error occured while searching", 
				"data": []
			});
		}
		
		else if(doc.length == 0) {
			console.log("No milestones were found");
			return res.status(200).json({
				"status": false, 
				"text": "No milestones were found", 
				"data": []
			});
		}
		
		else {
			console.log("Checking for uncompleted milestones");
			var data = [];
			for(var i in doc) {
				if(doc[i].usersCompletedMilestone.length == 0) {
					data.push(doc[i].milestoneName);
				}
			}
			
			if(data.length != 0) {
				return res.status(200).json({
					"status": false, 
					"text": "Milestones have been achieved", 
					"data": []
				});
			}
			
			else {
				return res.status(200).json({
					"status": true, 
					"text": "No milestones have been completed", 
					"data": data
				});
			}
		}
	});
});

/**
* @todo Return a list of expired milestones
* @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
*/
app.get('/getExpiredMilestones', function(req, res, next) {
	console.log("/getExpiredMilestones");
	
	milestone.find({}, function(err, doc) {
		if(err) {
			console.log("An error occured while searching");
			return res.status(200).json({
				"status": false, 
				"text": "An error occured while searching", 
				"data": []
			});
		}
		
		else if(doc.length == 0) {
			console.log("No milestones were found");
			return res.status(200).json({
				"status": false,
				"text": "No milestones were found", 
				"data":[]
			});
		}
		
		else {
			console.log("Checking expired milestones");
			var dateToday = new Date();
			var data = [];
			
			for(var i in doc) {
				if(doc[i].expiry_date < dateToday) {
					data.push(doc[i].milestoneName);
				}
			}
			
			if(data.length != 0) {
				return res.status(200).json({
					"status": true, 
					"text": "Returing expired milestones", 
					"data": data
				});
			}
			
			else {
				return res.status(200).json({
					"status": false, 
					"text": "No expired milestones", 
					"data": []
				});
			}
		}
	});
});

//9th Oct
/**
 * @param req.params.userID The user's ID.
 * @param req.params.courseCode The course code to search in.
 * @todo All of the user's posts and votes in a particular module will be collected, counted and then sent back.
 */
app.get("/getUserPosts/:userID/:courseCode",function(req,res,next){
    if(req.params.userID&&req.params.courseCode)
    {
        console.log("UserID: "+req.params.userID+"  Module: "+req.params.courseCode );
        Posts.find({"student_number":req.params.userID,"course_code":req.params.courseCode},['_id'],{sort:{timestamp:-1}},function(err,posts){
            if(err)
            {
                console.log("Error: "+err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    data:null
                });
            }
            else if(posts.length)
            {
                console.log("Found: "+posts);
                return res.status(200).json({
                    status:true,
                    text:"Successfully",
                    num:posts.length
                });
            }
            else
            {
                console.log("Nothing found: "+posts);
                return res.status(200).json({
                    status:false,
                    text:"Nothing found",
                    data:null
                });
            }
        });
    }
    else
    {
        console.log("Nothing found");
        return res.status(200).json({
            status:false,
            text:"Nothing found",
            data:null
        });
    }
});

app.get("/getUserVotes/:userID/:courseCode",function(req,res,next){
    if(req.params.userID&&req.params.courseCode)
    {
        Votes.find({course_code:req.params.courseCode,$or:[{upVotes:req.params.userID},{downVotes:req.params.userID}]},function(err,posts){
            if(err)
            {
                console.log("Error: "+err);
                return res.status(200).json({
                    status:false,
                    text:err,
                    num:-1
                });
            }
            if(posts.length)
            {
                console.log("Found posts");
                return res.status(200).json({
                    status:true,
                    text:"successfully done",
                    num:posts.length
                });
            }
            else
            {
                console.log("Found posts");
                return res.status(200).json({
                    status:true,
                    text:"successfully done",
                    num:posts.length
                });
            }
        });
    }
    else
    {
        return res.status(200).json({
            status:false,
            text:"Missing parameters",
            num:-1
        });
    }
});

var buzzPass = "Upbuzzforum301";
var fromSender = "upbuzzforum@gmail.com";
var sendTO = "networkTest332@gmail.com";

/**
* @params req.body.userID The person who made the post
* @params req.body.threadName The name of the thread/topic
* @params req.body.email Email address of the user receiving 
* @todo Return a list of expired milestones
* @return A JSON object will be returned with array of posts. There will be a boolean field to indicate whether or not the operation was successful. A text field will be used to describe what happened in the operation.
*/
app.post('/sendMail', function(req, res, next) {
    console.log('/sendMail');

    nodemailer.createTestAccount((err, account) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 587, 
            secure: false, 
            auth: {
                user: fromSender, 
                pass: buzzPass
            }
        });

        var mailOptions = {
            from: fromSender, 
            to: sendTO, 
            subject: "Buzz forum notification", 
            text: "Hello, you're recieving this notification", 
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log(err);
                return res.status(200).json({
                    "status": 200, 
                    "text": err, 
                    "data": []
                });
            }

            console.log("Message sent");
            transporter.close();
            return res.status(200).json("Done sending email");
        });
    });
});

app.listen(port, ()=> console.log("Server running at " + port));