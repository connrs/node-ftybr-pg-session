var test = require('tape');
var PgStoreMock = function () { PgStoreMock.init.apply(null, Array.prototype.slice.call(arguments)); };
var SessionsMock = function () { this.init.apply(this, Array.prototype.slice.call(arguments)); };
var pgSession;

require.cache[require.resolve('sessions-pg-store')] = { exports: PgStoreMock };
require.cache[require.resolve('sessions')] = { exports: SessionsMock };
pgSession = require('..');

test('Throws error if no client set', function (t) {
  t.plan(1);
  t.throws(pgSession, /No client provided to PG session middleware/);
});

test('Sets store and store options to sessions', function (t) {
  var client = {};
  t.plan(2);
  SessionsMock.prototype.init = function (Store, options, storeOptions) {
    t.equal(Store, PgStoreMock);
    t.deepEqual(storeOptions, {
      client: {},
      table: 'sess'
    });
  };
  pgSession(client, { table: 'sess' });
});

test('Middleware sets session to request', function (t) {
  var req = {};
  var res = {};
  var client = {};
  var sess = {
    test_a: 1,
    test_b: 9
  };

  t.plan(2);
  SessionsMock.prototype.init = function() {};
  SessionsMock.prototype.httpRequest = function (req, res, done) {
    done(null, sess);
  };
  pgSession(client, {})(req, res, function (err) {
    t.error(err);
    t.deepEqual(req.session, sess);
  });
});

test('Middleware returns error', function (t) {
  var req = {};
  var res = {};
  var client = {};

  t.plan(1);
  SessionsMock.prototype.init = function() {};
  SessionsMock.prototype.httpRequest = function (req, res, done) {
    done(new Error('SESSION PGSQL ERROR'));
  };
  pgSession(client, {})(req, res, function (err) {
    t.equal(err.message, 'SESSION PGSQL ERROR');
  });
});
