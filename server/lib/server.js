const restify = require('restify');
const qset = require('q-set');
const middleware = require('../middleware');

const serverOptions = {
  name: 'API Server'
};

const server = restify.createServer(serverOptions);

server.use(async function(req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000,https://*.cppthink.org");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Authorization");
});

server.use(middleware.attachUser);

server.use(restify.plugins.bodyParser({
    mapParams: false,
    maxBodySize: 16828416,
    mapFiles: false,
    multipartFileHandler: function(part, req) {
        if(!req.bufferFiles) {
            req.bufferFiles = {}
        }
        req.bufferFiles[part.name] = new Promise((resolve, reject) => {
            let chunks = [];
            part.on('data', (buffer) => chunks.push(buffer))
            part.on('end', () => {
                resolve({
                    filename: part.filename,
                    buffer: Buffer.concat(chunks)
                })
            })
            part.on('error', (err) => reject(err))
        })
    }
}));
server.use(function(req, res, next) {
    if(req.method==="POST" && req.getContentType() === 'multipart/form-data') {
        let body = {};
        Object.keys(req.body)
            .forEach(key => (
                body = qset.deep(body, key, req.body[key])
            )
        )
        req.body = body;
    }
    next();
})
server.use(restify.plugins.queryParser())

module.exports = server

