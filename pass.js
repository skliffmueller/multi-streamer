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

console.log(generatePassword(""));