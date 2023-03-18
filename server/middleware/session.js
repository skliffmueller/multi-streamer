const authDb = require('../lib/auth-db')

function attachUser(req, res, next) {
    req.user = false;
    if(req.headers['authorization']) {
        authDb.verifySession(req.headers['authorization'].split(' ').pop()).then((user) => {
            req.user = user;
            next();
        }).catch((e) => {
            next();
        });
    } else {
        next();
    }
}

module.exports = attachUser;