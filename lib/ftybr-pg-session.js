var Sessions = require('sessions');
var PgStore = require('sessions-pg-store');

function pgSession(options) {
  return middleware.bind(null, options);
}

function newSession(client, options) {
  return new Sessions(PgStore, {}, {
    client: client,
    table: options.table
  });
}

function middleware (options, req, res, done) {
  newSession(req.pgClient, options).httpRequest(req, res, onSessionHttpRequest.bind(null, req, res, done));
}

function onSessionHttpRequest(req, res, done, err, session) {
  if (err) {
    done(err);
  }
  else {
    req.session = session;
    done();
  }
}

module.exports = pgSession;
