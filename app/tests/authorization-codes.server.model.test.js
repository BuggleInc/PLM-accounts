'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	AuthorizationCodes = mongoose.model('AuthorizationCodes');

/**
 * Globals
 */
var user, authorizationCodes;

/**
 * Unit tests
 */
describe('Authorization codes Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			authorizationCodes = new AuthorizationCodes({
				// Add model fields
				// ...
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return authorizationCodes.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		AuthorizationCodes.remove().exec();
		User.remove().exec();

		done();
	});
});