const fs = require('node:fs/promises');
const crypto = require('crypto'); 
const path = require('path');

// Method to set salt and hash the password for a user 
function generatePassword(password, salt) {
    if(!salt) {
        salt = crypto.randomBytes(16);
    }
    return Buffer.from([
        ...salt,
        ...crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    ]).toString('base64');
};
     
   // Method to check the entered password is correct or not 
function validPassword(password, encrypted) {
    const hash = Buffer.from(encrypted, 'base64');

    return generatePassword(password, hash.slice(0, 16)) === encrypted; 
};

const EXPIRES = 1000 * 60 * 60 * 24;

class AuthDb {
    constructor(dbPath) {
        if(!dbPath) {
            this.dbPath = path.resolve(global.appRoot, "./data/users.json");
            console.log(this.dbPath);
        } else {
            this.dbPath = dbPath;
        }
        this.sessions = [];
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
    async getUsers() {
        return this.data.users.map(user => ({
            ...user,
            password: false,
        }));
    }
    async addUser({
        username,
        password,
        permissions
    }) {
        username = username.toLowerCase();
        password = generatePassword(password);

        if(!permissions || !permissions.length) {
            throw Error("Permissions not set");
        }

        if(username.length < 6) {
            throw Error("Username requires minimum 6 characters")
        }

        if(this.data.users.find(user => (user.username === username))) {
            throw Error("Username already exists");
        }

        this.data.users.push({
            username,
            password,
            permissions,
            master: false,
        });
        await this.write();
        return await this.getUsers();
    }
    async updateUser({
        username,
        password,
        permissions,
    }) {
        username = username.toLowerCase();
        const foundUserIndex = this.data.users.findIndex(user => (user.username === username));

        if(foundUserIndex === -1) {
            throw Error("Username does not exist");
        }

        const foundUser = this.data.users[foundUserIndex];
        if(this.data.users[foundUserIndex].master) {
            throw Error("Cannot modify master account");
        }

        if(password) {
            this.data.users[foundUserIndex].password = generatePassword(password);
        }
        if(permissions) {
            this.data.users[foundUserIndex].permissions = permissions;
        }
        await this.write();
        return await this.getUsers();
    }
    async removeUser(username) {
        username = username.toLowerCase();
        const foundUser = this.data.users.find(user => (user.username === username));

        if(!foundUser) {
            throw Error("Username does not exist");
        }
        if(foundUser.master) {
            throw Error("Cannot remove master account");
        }

        this.data.users = this.data.users.filter(user => user.username !== username);
        this.sessions = this.sessions.filter(session => (session.username !== username));
        await this.write();
        return await this.getUsers();
    }
    async createSession(username, password) {
        username = username.toLowerCase();
        const foundUser = this.data.users.find(user => (user.username === username));
        if(!foundUser) {
            throw Error("Username does not exist");
        }

        if(!validPassword(password, foundUser.password)) {
            throw Error("Invalid password");
        }
        const token = crypto.randomBytes(64).toString('base64');
        const expiresAt = Date.now() + EXPIRES;
        this.sessions.push({
            username: foundUser.username,
            permissions: foundUser.permissions,
            master: foundUser.master,
            expiresAt,
            token,
        });

        return this.sessions[this.sessions.length-1];
    }
    async verifySession(token) {
        const now = Date.now();
        this.sessions = this.sessions.filter(session => (now < session.expiresAt));
        const foundSessionIndex = this.sessions.findIndex(session => (session.token === token));
        if(foundSessionIndex === -1) {
            throw Error("Session not found");
        }

        this.sessions[foundSessionIndex].expiresAt = now + EXPIRES;

        const foundUser = this.data.users.find(user => (user.username === this.sessions[foundSessionIndex].username));

        if(!foundUser) {
            this.sessions = this.sessions.filter(session => (session.username !== this.sessions[foundSessionIndex].username));
            throw Error("Session not found");
        }

        return foundUser;
    }

}
const db = new AuthDb();

module.exports = db;

// const authDb = new AuthenticatorDb();
// console.log(authDb.fileContent);
// const pass = generatePassword("password");
// console.log(pass);
// console.log(validPassword("password", pass));
// console.log(validPassword("passworda", pass));