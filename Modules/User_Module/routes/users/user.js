var debug       = require('debug')('kumladi-api:routes:user');
var express     = require('express');
var user    = require('../../controllers/users/user');

debug('Creating user router');
var router = express.Router();

debug('Adding user route: PUSH / (Description: where user is created)');
router.post('/', user.create); // => PUSH to /create creates a new location.

/*--Still need to edit for CRUD operations--*/

debug('Location router exported');
module.exports = router;
