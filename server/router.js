const apiv100 = require('./controllers/1.0.0');

exports.mount = (server) => {
  apiv100.mount(server);
};