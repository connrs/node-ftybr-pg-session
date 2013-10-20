var Sessions = require('sessions');
var PgStore = require('sessions-pg-store');

function pgSession(client, options) {
  if (client === undefined) {
    throw new Error('No client provided to PG session middleware');
  }

  return middleware.bind(null, newSession(client, options));
}

function newSession(client, options) {
  return new Sessions(PgStore, {}, {
    client: client,
    table: options.table
  });
}

function middleware (session, req, res, done) {
  session.httpRequest(req, res, onSessionHttpRequest.bind(null, req, res, done));
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
