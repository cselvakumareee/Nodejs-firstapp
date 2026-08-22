import express from "express";
import path from 'path';
import { rootDir } from "../util/path";
import { getProducts } from "../controller/products";

const router = express.Router();
router.get('/', getProducts);

export default router;