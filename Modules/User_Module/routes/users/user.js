var debug       = require('debug')('kumladi-api:routes:user');
var express     = require('express');
var user    = require('../../controllers/users/user');

debug('Creating user router');
var router = express.Router();

debug('Adding user route: PUSH / (Description: where user is created)');
router.post('/', user.create); // => PUSH to /create creates a new location.

/*--Still need to edit for CRUD operations--*/

/*debug('Adding location route: GET / (Description: where location is retrieved via id)');
router.get('/:id', location.getById); // => GET to /:id

debug('Deleting location route: DELETE / (Description: where location is deleted)');
router.delete('/', location.delete); // => DELETE to /delete a location.

debug('Updating location route: PATCH / (Description: where location is updated)');
router.patch('/', location.patch); // => PATCH to /update a location*/

debug('Location router exported');
module.exports = router;
