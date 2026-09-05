// import fs from "fs";
// import path from "path";
// import { rootDir } from "../util/path";
// import { getDb } from "../util/database";
// import mongodb from "mongodb";

// const filePath = path.join(rootDir, "data", "products.json");

export type TypeProduct = {
  _id?: string;
  title: string;
  imageUrl?: string;
  description?: string;
  price?: number;
};


import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const product = mongoose.model("Product", productSchema);
