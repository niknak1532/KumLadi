var debug       = require('debug')('kumladi-api:routes:posts');
var express     = require('express');
var posts   = require('../../controllers/posts/posts');

debug('Creating post router');
var router = express.Router();


//Add routes (to functions) here
router.post('/addPost/:parentID',posts.appendPost);
router.get('/getRecentPosts/:course_code',posts.getLatestPosts);
router.get('/getChildPosts/:postID',posts.getChildPosts);
router.get('/getPosts/:course_code',posts.getPosts); // scrap it
router.post('/movePost/:postID/:parentID',posts.movePost);
debug('post router exported');
module.exports = router;

