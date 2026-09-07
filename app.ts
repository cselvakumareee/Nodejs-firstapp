/// <reference path="./typings/express.d.ts" />

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import http from "http";
import express from "express";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import shopRoutes from "./routes/shop";
import { rootDir } from "./util/path";
import session from "express-session";
import MongoDBStoreFactory from "connect-mongodb-session";

import path from "path/win32";
import { pageNotFoundController } from "./controller/error";
import mongoose from "mongoose";
import { User } from "./models/user";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const MONGODB_URI =
  "mongodb+srv://cselvakumareee_db_user:8FVP6mh7FYJ8bRHq@cluster0.1g9tmeq.mongodb.net/?appName=Cluster0";
const MongoDBStore = MongoDBStoreFactory(session);
const sessionStore = new MongoDBStore({
  uri: MONGODB_URI,
  databaseName: "shop",
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  }),
);

//filter paths if url will be admin then it will go to adminRoutes else it will go to shopRoutes
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(pageNotFoundController);
mongoose
  .connect(MONGODB_URI, { dbName: "shop" })
  .then(() => {
    // User.findOne().then((user: any) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "selva",
    //       email: "selva@test.com",
    //       cart: { items: [] },
    //     });
    //     user
    //       .save()
    //       .then(() => {
    //         console.log("User created successfully");
    //       })
    //       .catch((err: any) => {
    //         console.error("Error creating user:", err);
    //       });
    //   }
    // });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  })
  .catch((err: any) => {
    console.error("Error starting server:", err);
  });
