'use strict';

let controller = require('./controller');

async function authorizedRoute(req, res) {
  if(!req.user) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
  if(!req.user.master && req.user.permissions.indexOf("feeds") === -1) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
}

function mount(server) {

  server.post({path: '/api/nginx', version: '1.0.0'}, controller.index);

  // server.del({path: '/api/feeds', version: '1.0.0'}, [masterRoute, controller.remove]);

}

module.exports = {
  mount: mount
}