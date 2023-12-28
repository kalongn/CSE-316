## Instructions to setup and run project
```bash
cd server
npm install
mongod
nodemon server.js
node init.js <ADMIIN_USERNAME> <ADMIN_PASSWORD>
# the admin account created will be attached with a fake email address of
# <ADMIN_USERNAME>@fake_so.com, the reputation of admin is default to 50.

cd ../client
npm install
npm start

# essentially the same as hw3
```