var debug       = require('debug')('kumladi-api:routes:post');
var express     = require('express');
var post    = require('../../controllers/posts/post');

debug('Creating the post router');
var router = express.Router();

//Add routes (to functions) here
router.post('/createPost',post.createPost);
router.post('/editPost/:postID',post.editPost);
router.get('/removePost/:postID',post.removePost);
router.get('/getLevelPosts/:course_code',post.getAllPosts);
router.get('/script/',post.script);
module.exports = router;
