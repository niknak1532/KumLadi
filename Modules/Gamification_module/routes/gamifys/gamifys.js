var debug       = require('debug')('kumladi-api:routes:gamifys');
var express     = require('express');
var gamifys   = require('../../controllers/gamifys/gamifys');

debug('Creating gamification router');
var router = express.Router();

debug('Adding gamification route: GET / (Description: where gamification are retrieved)');
router.get('/', gamifys.get); // => GET to / lists all gamification*/

debug('gamifications router exported');
module.exports = router;
