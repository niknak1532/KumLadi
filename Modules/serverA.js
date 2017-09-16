/* Server - Recieves message*/
var ldap = require('ldapjs');
var assert = require('assert');

module.exports={
	getUserDetails :function(loginDetails){
		
		var ldap_cn = 'admin';
		var password = 'root';

		var ldap_url = 'ldap://192.168.56.101';
		var username = 'cn=' + ldap_cn + ',ou=Computer Science,o=University of Pretoria,c=ZA';

		var client = ldap.createClient({
			url: ldap_url, 
			tlsOptions: {
				rejectUnauthorized: true
			}
		});
		
		var uid = loginDetails.userID;
		
		console.log('Parameter => ' + uid);
		
		var opts = {
			filter: '(uid=' + uid + ')',
			scope: 'sub',
			attributes: ['cn', 'uid', 'mail']
		};
		
		client.bind(username, password, function(err) {
			console.log('Binding');
			assert.ifError(err);
		});
		
		client.search('ou=Computer Science,o=University of Pretoria,c=ZA', opts, function (err, res) {
			console.log('Searching LDAP');
			res.on('searchEntry', function(entry) {
				console.log(entry.object);
			});
			
			res.on('error', function(err) {
				console.error('Error: ' + err.message);
			});
			
			res.on('end', function(result) {
				if(result.status != 0) {
					console.log('Status: ' + result.status);
				}
			});
		});
		
		client.unbind(function(err) {
			assert.ifError(err);
		});
			
		var result = JSON.stringify(ldap);
		console.log('Sending file: ' + result);
		
		 return result; 
	}
};
