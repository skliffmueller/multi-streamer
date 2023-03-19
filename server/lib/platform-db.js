const fs = require('node:fs/promises');
const path = require('path');



class PlatformDb {
    constructor(dbPath) {
        if(!dbPath) {
            this.dbPath = path.resolve(global.appRoot, "./data/platforms.json");
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
    async getPlatforms() {
        return this.data.platforms;
    }
    async addPlatform({
        name,
        activated,
        url,
    }) {
        if(this.data.platforms.find(platform => (platform.name === name))) {
            throw Error("Name already exists");
        }

        this.data.platforms.push({
            name,
            activated: !!activated,
            url,
        });
        await this.write();
        return this.data.platforms;
    }
    async updatePlatform({
        name,
        activated,
        url,
    }) {
        const foundPlatformIndex = this.data.platforms.findIndex(platform => (platform.name === name));

        if(foundPlatformIndex === -1) {
            throw Error("Platform not found");
        }

        if(activated !== undefined) {
            this.data.platforms[foundPlatformIndex].activated = !!activated;
        }
        if(url) {
            this.data.platforms[foundPlatformIndex].url = url;
        }
        await this.write();
        return this.data.platforms;
    }
    async removePlatform(name) {
        const foundPlatform = this.data.platforms.find(platform => (platform.name === name));

        if(!foundPlatform) {
            throw Error("Platform not found");
        }

        this.data.platforms = this.data.platforms.filter(platform => platform.name !== name);
        await this.write();
        return this.data.platforms;
    }


}
const db = new PlatformDb();

module.exports = db;
