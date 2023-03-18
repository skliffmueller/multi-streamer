'use strict'

const recordings = require('./recordings')
const users = require('./users')
const servers = require('./servers')
const nginx = require('./nginx')
const feeds = require('./feeds')

function mount(server) {
  server.get({ path: '/', version: '1.0.0' }, async (req, res) => res.send(200, 'online'))

  nginx.mount(server)
  feeds.mount(server)
  recordings.mount(server)
  users.mount(server)
  servers.mount(server)
}

module.exports = {
  mount: mount
}