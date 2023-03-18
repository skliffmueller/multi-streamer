const fs = require('node:fs/promises');
const path = require('path');



class RtmpDb {
    constructor(dbPath) {
        if(!dbPath) {
            this.dbPath = path.resolve(global.appRoot, "./data/rtmp.json");
            console.log(this.dbPath);
        } else {
            this.dbPath = dbPath;
        }
        this.read();
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
    async getServers() {
        return this.data.servers;
    }
    async addServer({
        name,
        activated,
        url,
    }) {
        if(this.data.servers.find(server => (server.name === name))) {
            throw Error("Name already exists");
        }

        this.data.servers.push({
            name,
            activated: !!activated,
            url,
        });
        await this.write();
        return this.data.servers;
    }
    async updateServer({
        name,
        activated,
        url,
    }) {
        const foundServerIndex = this.data.servers.findIndex(server => (server.name === name));

        if(foundServerIndex === -1) {
            throw Error("Server not found");
        }

        if(activated !== undefined) {
            this.data.servers[foundServerIndex].activated = !!activated;
        }
        if(url) {
            this.data.servers[foundServerIndex].url = url;
        }
        await this.write();
        return this.data.servers;
    }
    async removeServer(name) {
        const foundServer = this.data.servers.find(server => (server.name === name));

        if(!foundServer) {
            throw Error("Server not found");
        }

        this.data.servers = this.data.servers.filter(server => server.name !== name);
        await this.write();
        return this.data.servers;
    }


}
const db = new RtmpDb();

module.exports = db;
