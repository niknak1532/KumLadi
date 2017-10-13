/* Server - Recieves message*/
var ldap = require('ldapjs');
var assert = require('assert');
var file = require('./server.js');

var ldap_cn = 'admin';
var password = 'root';

var ldap_url = 'ldap://192.168.56.101';
var username = 'cn=' + ldap_cn + ',ou=Computer Science,o=University of Pretoria,c=ZA';
var base = 'ou=computer science,o=university of pretoria,c=za';

module.exports={
/**
* @params loginDetails The username and password combination as json object
* @params callback The callback function
* @todo Get tge modules a user is registered to
* @return A JSON object witht the modules the user is registered to
*/
	getModules : function(loginDetails, callback){
		var client = ldap.createClient({
			url: ldap_url, 
			tlsOptions: {
				rejectUnauthorized: true
			}
		});
		
		var uid = loginDetails.userID;
		
		var opts = {
			filter: '(memberUid=' + uid + ')',
			scope: 'sub',
			attributes: 
				['cn']
		}

		var modules=[];
		console.log('Searching starts here');
		
		client.bind(username, password, function(err) {
			console.log('Binding');
			assert.ifError(err);
		});
		
		client.search(base, opts, function (err, res) {
			console.log('Searching LDAP');
			res.on('searchEntry', function(entry) {
				modules.push(entry.object.cn);
			});
			
			res.on('error', function(err) {
				console.error('Error: ' + err.message);
				callback(err);
			});
			
			res.on('end', function(result) {
				if(result.status != 0) {
					console.log('Status: ' + result.status);
				}
				callback(modules);
			});
			
		});
		
		client.unbind(function(err) {
			assert.ifError(err);
		});
	}, 

/**
* @params userDetails The username and password combination as json object
* @params callback The callback function
* @todo Validate user in LDAP
* @return A JSON object with the users details
*/
validateUser : function(userDetails, callback) {
		var client = ldap.createClient({
			url: ldap_url, 
			tlsOptions: {
				rejectUnauthorized: true
			}
		});
		
		var uid = userDetails.userID;
		
		console.log('userID: ' + uid);

		var opts = {
			filter: '(uid=' + uid + ')',
			scope: 'sub',
			attributes: 
				[ ]
		}

		var results = null;
		var ret = " ";
		console.log('Searching starts here');
		
		client.bind(username, password, function(err) {
			console.log('Binding');
			assert.ifError(err);
		});
		
		client.search(base, opts, function (err, res) {
			console.log('Searching LDAP');
			res.on('searchEntry', function(entry) {
				results = {
					title: entry.object.title,
					initials: entry.object.initials,
					name: entry.object.cn,
					surname: entry.object.zn, 
					userID: uid,
					email: entry.object.uid+"@tuks.co.za"
				}

				ret = JSON.stringify(results);
			});
			
			res.on('error', function(err) {
				console.error('Error: ' + err.message);
				callback(err);
			});
			
			res.on('end', function(result) {
				if(result.status != 0) {
					console.log('Status: ' + result.status);
				}
				callback(ret);
			});
			
		});
		
		client.unbind(function(err) {
			assert.ifError(err);
		});
	}
};
