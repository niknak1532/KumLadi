var debug             = require('debug')('kumladi-api:middleware:errors');
var express           = require('express');

debug('Initialising application');
var app = express();

debug('Initialising errors custom middleware');

debug('Defining error handler');
module.exports = function(err, req, res, next){
  debug(err);

   if(err.name == 'ValidationError') {
     response = {
      errors: [
        {
          status: 404, 
          title: 'Bad request', 
          detail: 'All the fields have to be filled'
        }
      ]
     }
     res.status(404).send(response);
   };

  if(err.name == 'CastError'){
    response = {
      errors: [
        {
          status: 404, 
          title: 'Not Found',
          detail:'The server has not found anything matching the Request-URI.'
        }
      ]
    }
	 res.status(404).send(response);
  };

   if(err.name == 'TypeError'){
    response = {
      errors: [
        {
          status:  400, 
          title: 'Bad Request',
          detail:'The request could not be understood by the server due to malformed syntax.'
        }
      ]
    }
	 res.status(400).send(response);
  };
};



