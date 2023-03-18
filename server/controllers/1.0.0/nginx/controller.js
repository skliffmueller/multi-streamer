const fs = require('node:fs/promises');
const path = require('path');
const feedsDb = require('../../../lib/feeds-db')

//Must have 6 - 16 characters, must be have a least a number and one special character
/*
{
  app: 'live',
  flashver: 'FMLE/3.0 (compatible; FMSc/1.0)',
  swfurl: 'rtmp://localhost:1935/live',
  tcurl: 'rtmp://localhost:1935/live',
  pageurl: '',
  addr: '172.17.0.1',
  clientid: '1',
  call: 'publish',
  name: 'test',
  type: 'live'
}
{
  app: 'live',
  flashver: 'LNX 9,0,124,2',
  swfurl: '',
  tcurl: 'rtmp://localhost:1935/live',
  pageurl: '',
  addr: '127.0.0.1',
  clientid: '19',
  call: 'play',
  name: 'test',
  start: '4294965296',
  duration: '0',
  reset: '0'
}
*/
async function index(req, res) {
  const { app, name } = req.body;

  if(app !== "live") {
    res.json(403, {
      blocked: true,
    });
    return;
  }

  const feeds = await feedsDb.getRawFeeds();
  const foundFeed = feeds.find((feed) => (feed.key === name));

  if(!foundFeed || !foundFeed.activated) {
    res.json(403, {
      blocked: true,
    });
    return;
  }
  console.log(foundFeed);
  res.json(200, {
    ok: true,
  });
}

module.exports = {
  index,
};