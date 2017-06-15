var debug       = require('debug')('kumladi-api:routes:users');
var express     = require('express');
var users   = require('../../controllers/users/users');

debug('Creating users router');
var router = express.Router();

debug('Adding user route: GET / (Description: where users are retrieved)');
router.get('/', users.get); // => GET to / lists all locations

/*--Still need to edit for CRUD operations--*/
debug('Locations router exported');
module.exports = router;
