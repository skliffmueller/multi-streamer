const path = require('path');
global.appRoot = path.resolve(__dirname);

const httpGlobalAgent = require('http').globalAgent;
httpGlobalAgent.keepAlive = true;
httpGlobalAgent.maxSockets = Infinity;

const httsGlobalAgent = require('https').globalAgent;
httsGlobalAgent.keepAlive = true;
httsGlobalAgent.maxSockets = Infinity;

const server = require('./lib/server');
const router = require('./router');

router.mount(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});