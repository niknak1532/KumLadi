var bodyParser        = require('body-parser');
var config            = require('config');
var debug             = require('debug')('kumladi-api:index');
var errors            = require('./middleware/errors');
var express           = require('express');
var post          = require('./routes/posts/post'); 
var posts         = require('./routes/posts/posts');
var mongoose          = require('mongoose');

debug('Dumping config:');
debug(config);

debug('Initialising environment variables');
var mongoHost = config.servers.mongodb.host;
var mongoDatabase = config.servers.mongodb.database;

debug('Connecting to mongo database');
mongoose.connect('mongodb://' + mongoHost + '/' + mongoDatabase);

debug('Creating application');
var app = express();

debug('Adding middleware');

debug('Adding body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

debug('Adding routes');
debug('Adding route: post');
app.use('/post', post);
debug('Adding route: posts');
app.use('/posts', posts);

debug('Adding final middleware');
debug('Adding generic error middleware');
app.use(errors);

debug('Creating server');
app.listen(3000, function(){
debug('Listening on http://localhost:3000');
});
