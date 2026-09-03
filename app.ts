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
import { mongoConnect } from "./util/database";
import { getUserById } from "./models/user";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use(async (req, res, next) => {
  await getUserById("6a983466d6a76cbb537fa333")
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

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
  });
});
