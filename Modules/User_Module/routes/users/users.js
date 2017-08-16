var debug       = require('debug')('kumladi-api:routes:users');
var express     = require('express');
var users   = require('../../controllers/users/users');

debug('Creating users router');
var router = express.Router();

//Add routes (to functions) here

debug('User router exported');
module.exports = router;

