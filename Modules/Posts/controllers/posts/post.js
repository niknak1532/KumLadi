var debug   = require('debug')('kumladi-api:controllers:post');
var Posts     = require('../../models/post');
var mongoose=require('mongoose');
var id=mongoose.Types.ObjectId;
debug('Initialising the post controller');
var _=require('lodash');
debug('Exporting method: create');
//Add function here
var fs=require('fs');
var object=JSON.parse(fs.readFileSync('./done.json','utf8'));
var array=[];
var rejected=[];
module.exports.script=function(req,res,next){
	array=[];
	for(var i=0;i<object.length*2;i++)
		array.push(new id());
	startWriting(object);
	res.status(200).send(rejected);
};
function startWriting(object)
{	
	array=[];
	rejected=[];
	_.forEach(object,function(object){
		console.log('\nCreating new post');
		//console.log(object['PostID']);
		//array.push(new id());
		var par=null;
		
		if(object['ParentPostID']!='0')
			par= array[parseInt(object['ParentPostID'])-1];
		
		var data=new Posts({
			_id:array[parseInt(object['PostID'])-1],
			student_number:object['UserID'],
			child_list:[],
			tag_list:[],
			level_number:parseInt(object['Level']),
			parent_ID:par,
			heading:object['Heading'],
			timestamp:new Date(object['TimeStamp']),
			content:object['Content'],
			course_code:'COS101'
		});
		
		console.log('Saving new post');
		data.save(function(err,data){
			console.log('in save');
			if(err){ 
				console.log('Encountered error: ',err);
				rejected.push(1);
			}
			if(data)
			{
				if(data.parent_ID)
				{
					console.log('Appending to parent post');
					Posts.findById(data.parent_ID,function(err,papa){
						if(err) console.log(err);
						if(papa)
						{
							papa.child_list.push(data._id);
							papa.save(function(err,obj){
								if(err) console.log(err);
								else console.log('Successfully appended to parent post');
							});
						}
					});
				}
				console.log(data);
				console.log('Done saving post');
			}
			else
			{
				console.log('Nothing saved');
			}
		});
	});
}








/**
* @params req.params.course_code The course code.
* @params req.params.content The content to be added.
* @params req.params.heading The heading ofthe post.
* @params req.params.student_number The student number of the creator of the post.
* @params req.params.tag_list The array of the tag lists to be added.
* @todo A post will be created and saved on the database.
* @return A JSON object will be returned. If successful then the post's ID will be in the object.
*/
module.exports.createPost=function(req,res,next){
	
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
				debug("Encountered an error: "+err);
				res.status(504).send({"data":err});
			}
			else if(!obj)
			{
				debug("Failed to save the document. May be missing parameters");
				res.status(405).send({"data":"Failed to save the document. May be missing parameters"});
			}
			else
			{
				res.status(200).send({
					post_ID:obj._id,
					heading:obj.heading
				});
			}
		});
};
/**
* @params req.params.postID The ID of the post to be updated.
* @params req.body.tag_list The taglists to be added.
* @todo The post to be edited will be found using it's ID then the tag list will be updated.
* @return A JSON object will be returned. If successful then it will contain the post's ID, otherwise it an error message will be in the object.
*/
module.exports.editPost=function(req,res,next){
	if(req.params.postID)
	{
		Posts.find({"_id":req.params.postID},function(err,doc){
			if(err)
			{
				debug("An error was encountered: ",err);
				res.status(504).send({"data":err});
			}
			else if(!doc)
			{
				debug("Failed to edit the post");
				res.status(504).send({"data":"Failed to edit the post"});
			}
			else
			{
				doc.child_list.addToSet(req.body.tag_list);
				doc.save(function(err,doc){
					if(err)
					{
						debug("Encountered error");
					}
				});
				res.status(200).send({
					postID:doc._id
				});
			}
		});
	}
	else
	{
		console.log("Parameters were missing");
		res.status(405).send({"data":"Parameters were missing"});
	}
};

/**
* @params req.params.postID The ID of the post to be removed
* @todo The post will be found using it's ID and then removed.
* @return Nothing will be returned.
*/

// make all the posts removed, and their children, invisible
// check if post has children
// higher level users can hide posts with children
module.exports.removePost=function(req,res,next){
	if(req.params.postID)
	{
		Posts.find({"course_code":req.params.postID},['_id'],function(err,data){
			if(err) res.status(404).send('faile');
			_.forEach(data,function(data){
			
				Posts.remove({"_id":data._id},function(err){});
			});
			res.status(200).send('done');
		});
		/*Posts.remove({"_id":req.param.postID},function(err,data){
			if(err)
			{
				debug("Encountered an error: ",err);
				req.status(504).send(err);
			}
			if(data)
				res.status(200).send({yu:"done",obj:data});
			else
				res.status(200).send("done");
		});*/
	}
};
/**
* @params req.params.course_code The course code for the posts to be found.
* @todo All the level-0 posts will be sorted in ascending order then their IDs and heading will be returned.
* @return A JSON object will be returned. If successful then every index of the array will contain a JSON object.
*/ 
module.exports.getAllPosts=function(req,res,next){
	if(req.params.course_code)
	{
		Posts.find({"level_number":0,"course_code":req.params.course_code},['heading','_id','level_number'],{skip:0,limit:10,sort:{"timestamp":-1}},function(err,doc){
			var docs=[];
			if(err)
			{
				debug("Encountered error while retriving documents");
				
			}
			else if(doc)
			{
				_.forEach(doc,function(u){
					docs.push({
						heading:u.heading,
						postID:u._id,
						level:u.level_number
					});
				});
				if(docs.length==null||docs.length==0)
				{
					debug("No posts were found");
				}
				else
				{
					debug("Found all the level-0 posts");
				}
				res.status(200).send({result:docs});
			}
			else 
			{
				res.status(504).send({"data":"Encountered error while retriving documents"});
			}
		});
	}
	else
		res.status(405).send("No parameters sent");
};
