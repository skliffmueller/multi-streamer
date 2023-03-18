const fs = require('node:fs/promises');
const path = require('path');

//Must have 6 - 16 characters, must be have a least a number and one special character
const regularExpression = /^[a-zA-Z0-9_-]{6,32}$/;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

async function index(req, res) {
  const dirList = await fs.readdir('/var/www/html/videos');
  const recordingsObject = dirList.reduce((prev, curr, index) => {
    let split = curr.split('.');
    const ext = split.pop().toLowerCase();
    split = split.join('.');
    
    if(ext !== 'jpg' && ext !== 'mp4' && ext !== 'flv') {
      return prev;
    }

    if(ext === 'jpg' || ext === 'mp4') {
      split = split.split('-');
      split.pop();
      split = split.join('-');

      if(!prev[split]) {
        prev[split] = {
          name: "",
          duration: 0,
          startDate: "",
          live: false,
          thumb: "",
          mp4: "",
          flv: "",
        };
      }
  
      if(ext === 'jpg') {
        prev[split].thumb = curr;
      } else if(ext === 'mp4') {
        prev[split].mp4 = curr;
      }
    } else {
      if(!prev[split]) {
        prev[split] = {
          name: "",
          duration: 0,
          startDate: "",
          live: false,
          thumb: "",
          mp4: "",
          flv: "",
        };
      }
      if(ext === 'flv') {
        prev[split].flv = curr;
      }
    }

    return prev;
  }, {});

  const recordings = Object.keys(recordingsObject).map(key => {
    const obj = recordingsObject[key];
    obj.name = key;
    obj.live = (obj.mp4 === "" && obj.flv !== "");

    if(obj.mp4 !== "") {
      obj.duration = obj.mp4.split('-').pop();
      obj.duration = obj.duration.split('.');
      obj.duration.pop();
      obj.duration = parseInt(obj.duration.join('.'));
    }

    const timeSplit = key.split('-');
    const time = timeSplit.pop().split(':');
    const year = timeSplit.pop();
    const month = timeSplit.pop();
    const day = timeSplit.pop();
    const second = time.pop();
    const minute = time.pop();
    const hour = time.pop();

    const startDate = new Date();
    startDate.setUTCFullYear(`20${year}`);
    startDate.setUTCMonth(months.indexOf(month));
    startDate.setUTCDate(day);
    startDate.setUTCHours(hour);
    startDate.setUTCMinutes(minute);
    startDate.setUTCSeconds(second);
    startDate.setUTCMilliseconds(0);

    obj.startDate = startDate;

    return obj;
  }).sort((a, b) => (new Date(b.startDate) - new Date(a.startDate)));

  res.json(200, {
    result: recordings,
  });
}

async function remove(req, res) {
  res.json(200, {
    result: [],
  });
}

module.exports = {
  index,
  remove,
};