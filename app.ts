/// <reference path="./typings/express.d.ts" />

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import http from "http";
import express from "express";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import { rootDir } from "./util/path";

import path from "path/win32";
import { pageNotFoundController } from "./controller/error";
// import { getUserById } from "./models/user";
import mongoose from "mongoose";
import { User } from "./models/user";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use(async (req, res, next) => {
  await User.findById("6a999760addb306d50bc7f53")
    .then((user: any) => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch((err: any) => {
      console.error("Error fetching user:", err);
      next(err);
    });
});
//filter paths if url will be admin then it will go to adminRoutes else it will go to shopRoutes
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(pageNotFoundController);
mongoose
  .connect(
    "mongodb+srv://cselvakumareee_db_user:8FVP6mh7FYJ8bRHq@cluster0.1g9tmeq.mongodb.net/?appName=Cluster0",
    { dbName: "shop" },
  )
  .then(() => {
    User.findOne().then((user: any) => {
      if (!user) {
        const user = new User({
          name: "selva",
          email: "selva@test.com",
          cart: { items: [] },
        });
        user
          .save()
          .then(() => {
            console.log("User created successfully");
          })
          .catch((err: any) => {
            console.error("Error creating user:", err);
          });
      }
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  })
  .catch((err: any) => {
    console.error("Error starting server:", err);
  });
