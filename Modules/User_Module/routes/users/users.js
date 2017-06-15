var debug       = require('debug')('kumladi-api:routes:users');
var express     = require('express');
var users   = require('../../controllers/users/users');

debug('Creating users router');
var router = express.Router();

debug('Adding user route: GET / (Description: where users are retrieved)');
router.get('/', users.get); // => GET to / lists all locations

/*--Still need to edit for CRUD operations--*/

/*debug('Adding locations route: GET /getByBuildingName/:building (Description: where locations in a specified building are retrieved)');
router.get('/getByBuildingName/:building', locations.getByBuildingName); // => GET to /:building lists all locations at specified building

debug('Adding locations route: POST /getRoute (Description: where points from A to B are calculated and returned)');
router.post('/getRoute', locations.getRoute); // => PUSH to /getRoute creates a route. lists all locations from A to B

debug('Adding location route: GET /getBuildingNames/:building (Description: A distinct list of all building names is retrieved)');
router.get('/getBuildingNames', locations.getBuildingNames); //=> Get to / lists all building names
*/
debug('Locations router exported');
module.exports = router;
