// import http from "http";
// import express from "express";

// const app = express();
// app.use((req, res, next) => {
//   console.log('im a middleware');
//   next();
// })

// app.use('/message',(req, res, next) => {
//   console.log('im in a another middleware');
//   res.send('Hello from express');
// })

// const server = http.createServer(app);

// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });

import http from "http";
import express from "express";
import bodyParser from "body-parser";
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { rootDir } from "./util/path";

import path from "path/win32";
const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

//filter paths if url will be admin then it will go to adminRoutes else it will go to shopRoutes  
app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, 'views', 'page-not-found.html'));
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
// const server = http.createServer(app);
// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });  