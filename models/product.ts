import fs from "fs";
import path from "path";
import { rootDir } from "../util/path";
import { getDb } from "../util/database";
import mongodb from "mongodb";

const filePath = path.join(rootDir, "data", "products.json");

export type Product = {
  _id?: string;
  title: string;
  imageUrl?: string;
  description?: string;
  price?: number;
};

/** Retrieves all products from the MongoDB products collection. */
export async function getProductsFromFile(): Promise<Product[]> {
  try {
    const db = getDb();
    const products = await db.collection("products").find().toArray();
    return products as Product[];
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return [];
  }
}

/**
 * Retrieves a product by its MongoDB ObjectId.
 *
 * @param productId - The hexadecimal MongoDB ObjectId string.
 * @returns The matching product, or undefined when no product exists.
 */
export async function getProductById(
  productId: string,
): Promise<Product | undefined> {
  const db = getDb();
  const product = await db
    .collection("products")
    .findOne({ _id: new mongodb.ObjectId(productId) });
  return product as Product | undefined;
}

/**
 * Inserts a new product into the MongoDB products collection.
 *
 * @param productData - Product fields submitted by the administrator.
 */
export async function product(productData?: {
  title: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  userId: { _id: string };
}) {
  const title: string = productData?.title?.trim() || "";
  const imageUrl: string = productData?.imageUrl?.trim() || "";
  const description: string = productData?.description?.trim() || "";
  const price = productData?.price || 0;
  if (!title) {
    return [];
  }
  console.log("userId", productData);
  const db = getDb();
  db.collection("products")
    .insertOne({
      title,
      imageUrl,
      description,
      price,
      userId: productData?.userId,
    })
    .then((result: any) => {
      console.log("Product inserted:", result.insertedId);
    })
    .catch((err: any) => {
      console.error("Error inserting product:", err);
    });
}

/**
 * Updates an existing product in the MongoDB products collection.
 *
 * @param productId - The hexadecimal MongoDB ObjectId string.
 * @param title - The updated product title.
 * @param imageUrl - The updated product image URL.
 * @param description - The updated product description.
 * @param price - The updated product price.
 */
export async function editProduct(
  productId: string,
  title: string,
  imageUrl?: string,
  description?: string,
  price?: number,
) {
  const products = await getProductsFromFile();
  const db = getDb();
  if (!products) {
    return;
  }
  const existingProductIndex = products?.findIndex(
    (product) => product?._id === productId,
  );
  const existingProduct = products?.[existingProductIndex];
  if (existingProduct) {
    const updateProduct = {
      ...existingProduct,
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
    };
    products[existingProductIndex] = updateProduct;
  }
  db.collection("products")
    .updateOne(
      { _id: new mongodb.ObjectId(productId) },
      { $set: { title, imageUrl, description, price } },
    )
    .then((result: any) => {
      console.log("Product updated:", result.modifiedCount);
    })
    .catch((err: any) => {
      console.error("Error updating product:", err);
    });
  // fs.writeFileSync(filePath, JSON.stringify(products));
}

/**
 * Deletes a product from the MongoDB products collection.
 *
 * @param productId - The hexadecimal MongoDB ObjectId string.
 */
export async function deleteProduct(productId: string) {
  const db = getDb();
  db.collection("products")
    .deleteOne({ _id: new mongodb.ObjectId(productId) })
    .then((result: any) => {
      console.log("Product deleted:", result.deletedCount);
    })
    .catch((err: any) => {
      console.error("Error deleting product:", err);
    });
}
