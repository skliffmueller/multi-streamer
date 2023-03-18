'use strict';

let controller = require('./controller');

async function authorizedRoute(req, res) {
  if(!req.user) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
  if(!req.user.master && req.user.permissions.indexOf("recordings") === -1) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
}

async function masterRoute(req, res) {
  if(!req.user) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
  if(!req.user.master) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
}

function mount(server) {

  server.get({path: '/api/recordings', version: '1.0.0'}, [authorizedRoute, controller.index]);

  server.del({path: '/api/recordings', version: '1.0.0'}, [masterRoute, controller.remove]);

}

module.exports = {
  mount: mount
}