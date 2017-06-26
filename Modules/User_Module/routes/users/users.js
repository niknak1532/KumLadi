var debug       = require('debug')('kumladi-api:routes:users');
var express     = require('express');
var users   = require('../../controllers/users/users');

debug('Creating users router');
var router = express.Router();

debug('Adding user route: GET / (Description: where users are retrieved)');
router.get('/', users.get); // => GET to / lists all students

debug('Adding users route: GET /getBySN/:student_number (Description: where users with specified student number is retrieved)');
router.get('/getBySN/:student_number', users.getBySN) //=> to getBySN/student list all details of student with specified student_number

debug('Users router exported');
module.exports = router;
