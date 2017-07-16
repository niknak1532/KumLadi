var debug       = require('debug')('kumLadi-api:models:message');
var mongoose    = require('mongoose');

debug('Initialising model: Message');

debug('Defining schema: Message');

// 1st
var Message_module = new mongoose.Schema({
   module_Code: {
       type: String
   }, 

   thread_Name: [Schema.Types.Objectid] /*Thread -- Subject*/
});


debug('Message model exported');
module.exports = mongoose.model('Message', Message_module);
