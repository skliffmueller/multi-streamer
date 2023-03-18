'use strict';

let controller = require('./controller');

async function authorizedRoute(req, res) {
  if(!req.user) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
  if(!req.user.master && req.user.permissions.indexOf("users") === -1) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
}

async function sessionRoute(req, res) {
  if(!req.user) {
    res.json(403, {
      error: "UNAUTHORIZED"
    });
    return;
  }
}

function mount(server) {
 
  server.get({path: '/api/users', version: '1.0.0'}, [authorizedRoute, controller.index]);

  server.post({path: '/api/users', version: '1.0.0'}, [authorizedRoute, controller.create]);

  server.put({path: '/api/users', version: '1.0.0'}, [authorizedRoute, controller.update]);

  server.del({path: '/api/users', version: '1.0.0'}, [authorizedRoute, controller.remove]);

  server.get({path: '/api/auth/me', version: '1.0.0' }, [sessionRoute, controller.me])

  server.post({path: '/api/auth/login', version: '1.0.0'}, controller.login);

}

module.exports = {
  mount: mount
}