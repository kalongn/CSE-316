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

```

Website is not deployed as it is not secure and will attempt to rebuild with the same standard in a React.js, Next.js and MongoDB / Postgresql.   
### Below are the images of the website
- Home Page
![Home Page](./images/Home-Page.png)
- Question Page
![Question Page](./images/Question-Page.png)
- Ask Question Page
![Ask Question Page](./images/Ask-Question-Page.png)
- Question Detail Page
![Question Detail Page](./images/Question-Detail-Page.png)
- Profile Page (Admin)
![Profile Page](./images/Admin-Profile-Page.png)