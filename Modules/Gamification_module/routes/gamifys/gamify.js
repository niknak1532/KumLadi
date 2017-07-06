var debug       = require('debug')('kumladi-api:routes:gamify');
var express     = require('express');
var gamify    = require('../../controllers/gamifys/gamify');

debug('Creating gamify router');
var router = express.Router();

debug('Adding gamify route: PUSH / (Description: where gamification is created)');
router.post('/', gamify.create); // => PUSH to /create creates a new gamification.

debug('Gamify router exported');
module.exports = router;
