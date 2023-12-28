// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const { userCreate } = require('./serverExport');

let userArgs = process.argv.slice(2);
if (userArgs.length != 2) {
    console.log("Please provide admin credentials as arguments.");
    process.exit(1);
}

const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const adminUserName = userArgs[0];
const adminPassword = userArgs[1];
const adminEmail = adminUserName + "@fake_so.com";

const bcrypt = require('bcrypt');
const saltRounds = 10;

const populate = async () => {
    let salt = await bcrypt.genSalt(saltRounds);
    const adminHashedPassword = await bcrypt.hash(adminPassword, salt);
    await userCreate(adminUserName, adminEmail, adminHashedPassword, 'ADMIN', 50);
    if (db) {
        db.close();
    }
    console.log('done');
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');