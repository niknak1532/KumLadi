var debug       = require('debug')('kumladi-api:routes:user');
var express     = require('express');
var user    = require('../../controllers/users/user');

debug('Creating the user router');
var router = express.Router();

debug('Adding user route: push / (Description: where user is created)');
router.post('/addUser', user.addUser); //=> Push to /create a new vote

debug('Adding user route: delete / (Description: where user is deleted)');
router.delete('/deleteUser', user.deleteUser);

debug('Adding user route: getUser /');
router.get('/getUser/:userID', user.getUser);

debug('Adding user route: get / Description: where users are retrieved');
router.get('/display', user.display);

module.exports = router;
