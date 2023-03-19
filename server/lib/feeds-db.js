const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('path');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

const axios = require('axios').create({
    baseURL: "http://localhost",
    responseType: "text",
    timeout: 1000,
});

function parseXML(data) {
    const dom = new JSDOM(data, {
        contentType: "text/xml",
    });

    const xmlDoc = dom.window.document;
    const applicationNodes = xmlDoc.querySelectorAll('rtmp > server > application');
    const applications = [];
    applicationNodes.forEach((liveNode) => {
        const applicationName = liveNode.querySelector('name')?.textContent || "";
        const streamNodes = liveNode.querySelectorAll('live > stream');
        streamNodes.forEach((streamNode) => {
            applications.push({
                app: applicationName,
                name: (streamNode.querySelector('name')?.textContent || ""),
                time: parseInt(streamNode.querySelector('time')?.textContent || "0"),
                bytesIn: parseInt(streamNode.querySelector('bytes_in')?.textContent || "0"),
                bytesOut: parseInt(streamNode.querySelector('bytes_out')?.textContent || "0"),
        
                width: parseInt(streamNode.querySelector('meta > video > width')?.textContent || "0"),
                height: parseInt(streamNode.querySelector('meta > video > height')?.textContent || "0"),
                frameRate: parseInt(streamNode.querySelector('meta > video > frame_rate')?.textContent || "0"),
                videoCodec: streamNode.querySelector('meta > video > codec')?.textContent || "",
        
                channels: parseInt(streamNode.querySelector('meta > audio > channels')?.textContent || "0"),
                sampleRate: parseInt(streamNode.querySelector('meta > audio > sample_rate')?.textContent || "0"),
                audioCodec: streamNode.querySelector('meta > audio > codec')?.textContent || "",
        
                publishing: !!streamNode.querySelector('publishing'),
                active: !!streamNode.querySelector('active')
            });
        });
    });
    
    return applications;
}



/*

INPUT=rtmp://localhost:1935/live/tommy-123
STREAMS="[f=flv:onfail=ignore]rtmp://a.rtmp.youtube.com/live2/p1yv-a52j-92r0-xv90-3yw5|[f=flv:onfail=ignore]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW"
 */

class FeedsDb {
    constructor(dbPath) {
        if(!dbPath) {
            this.dbPath = path.resolve(global.appRoot, "./data/feeds.json");
            console.log(this.dbPath);
        } else {
            this.dbPath = dbPath;
        }
        this.applications = [];
        this.read();
        this.childProcess = null;
    }
    async read() {
        try {
            this.data = JSON.parse(await fs.readFile(this.dbPath, 'utf-8'));
        } catch(e) {
            this.data = null;
        }

    }
    async write() {
        await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    }
    async setApplications(applications) {
        this.applications = applications;

        // const feeds = await this.getFeeds();
        // const foundFeed = feeds.find((feed) => (feed.application && feed.broadcast));
    }
    async getFeeds() {
        return this.data.feeds.map((feed) => {
            const application = this.applications.find(application => {
                return feed.key === application.name && application.app === "live"
            }) || null;
            return {
                ...feed,
                application,
            }
        });
    }
    async getRawFeeds() {
        return this.data.feeds;
    }
    async addFeed({
        name,
        activated,
        key,
    }) {
        if(this.data.feeds.find(feed => (feed.name === name))) {
            throw Error("Name already exists");
        }

        this.data.feeds.push({
            name,
            activated: !!activated,
            broadcast: false,
            key,
        });
        await this.write();
        return await this.getFeeds();
    }
    async updateFeed({
        name,
        activated,
        broadcast,
        key,
    }) {
        const foundFeedIndex = this.data.feeds.findIndex(feed => (feed.name === name));

        if(foundFeedIndex === -1) {
            throw Error("Feed not found");
        }

        if(activated !== undefined) {
            this.data.feeds[foundFeedIndex].activated = !!activated;
        }
        if(broadcast !== undefined) {
            this.data.feeds = this.data.feeds.map(feed => ({...feed, broadcast: false}));
            this.data.feeds[foundFeedIndex].broadcast = !!broadcast;
        }
        if(key) {
            this.data.feeds[foundFeedIndex].key = key;
        }
        await this.write();
        return await this.getFeeds();
    }
    async removeFeed(name) {
        const foundFeed = this.data.feeds.find(feed => (feed.name === name));

        if(!foundFeed) {
            throw Error("Feed not found");
        }

        this.data.feeds = this.data.feeds.filter(feed => feed.name !== name);
        await this.write();
        return await this.getFeeds();
    }


}
const db = new FeedsDb();

const statsRequest = () => {
    axios.get('/stats')
        .then((response) => {
            if(response.status == 200) {
                db.setApplications(parseXML(response.data));
            }
        })
        .catch((e) => {
            console.error(e);
        });
}

setInterval(() => {
    statsRequest();
}, 1000);



module.exports = db;
