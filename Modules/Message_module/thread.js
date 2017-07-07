var debug       = require('debug')('kumLadi-api:models:thread');
var mongoose    = require('mongoose');

debug('Initialising model: Thread');

debug('Defining schema: Thread');

// 2nd
var Thread = new mongoose.Schema({
    student_number: { //for the creator of the thread
       type: String
    }, 

    thread_name: {
        type: String
    }, 

    post: [Schema.Types.Objectid] /*Post array*/ 

    thread_tags: {
         type: [String]
    }, 

    participants: { /* *=all users*/
         type: [String]
    }
});

debug('Thread model exported');
module.exports = mongoose.model('Thread', Thread);