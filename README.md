Run Container:

```
docker run -p 27017:27017 -d -v /Users/erwin_vides/Documents/UNIVO/nodejs mono-micro/03-rest-server-espanol/sever-poo/docker:/data/db --name
server-poo mongo
```

Start server

```
nodemon app.js
```
