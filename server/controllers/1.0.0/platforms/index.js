'use strict';

let controller = require('./controller');

async function authorizedRoute(req, res) {
  if(!req.user) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
  if(!req.user.master && req.user.permissions.indexOf("platforms") === -1) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
}

function mount(server) {

  server.get({path: '/api/platforms', version: '1.0.0'}, [authorizedRoute, controller.index]);

  server.post({path: '/api/platforms', version: '1.0.0'}, [authorizedRoute, controller.create]);

  server.put({path: '/api/platforms', version: '1.0.0'}, [authorizedRoute, controller.update]);

  server.del({path: '/api/platforms', version: '1.0.0'}, [authorizedRoute, controller.remove]);

}

module.exports = {
  mount: mount
}