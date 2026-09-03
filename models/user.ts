import { getDb } from "../util/database";
import mongodb from "mongodb";
import { Product } from "./product";

export function createUser(userName: string, email: string, password: string) {
  const db = getDb();
  return db.collection("users").insertOne({ name: userName, email, password });
}

export async function getCart() {
  const db = getDb();
  return await db
    .collection("users")
    .findOne({ cart: { $exists: true } })
    .then((user: any) => {
      if (!user) {
        return { items: [] };
      }
      return user.cart;
    });
}

export async function getUserById(userId: string) {
  const db = getDb();
  return await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(userId) })
    .then((user: any) => {
      return user;
    })
    .catch((err: any) => {
      console.error("Error fetching user by ID:", err);
      throw err;
    });
}

export async function addToCart(product: Product, userId: string) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const cartProductIndex = user.cart.items.findIndex(
    (p: { productId: string; quantity: number }) =>
      p.productId.toString() === product._id?.toString(),
  );
  const updatedCartItems = [...user.cart.items];
  let newQuantity = 1;
  if (cartProductIndex >= 0) {
    newQuantity = user.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: new mongodb.ObjectId(product._id),
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  const db = getDb();
  return await db
    .collection("users")
    .updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $set: { cart: updatedCart } },
    );
}

export async function deleteCart(productId: string, userId: string) {
  const db = getDb();
  const cart = await getCart();
  const updatedCart = { ...cart };
  // const product = updatedCart.items.find(
  //   (prod: { productId: string; quantity: number }) =>
  //     prod.productId.toString() === productId,
  // ); {
  updatedCart.items = updatedCart.items.filter(
    (p: { productId: string; quantity: number }) =>
      p.productId.toString() !== productId,
  );
  return await db
    .collection("users")
    .updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $set: { cart: updatedCart } },
    );
}

export async function addOrder(userId: string) {
  const db = getDb();
  const user = await getUserById(userId);
  if (!user?.cart?.items?.length) {
    throw new Error("Cannot create an order from an empty cart");
  }
  const cart = user.cart;
  const products = await Promise.all(
    cart.items.map(async (item: { productId: string; quantity: number }) => {
      const product = await db.collection("products").findOne({
        _id: new mongodb.ObjectId(item.productId),
      });
      return product ? { ...product, quantity: item.quantity } : null;
    }),
  );
  const order = {
    userId: new mongodb.ObjectId(userId),
    items: products.filter((product) => product !== null),
    name: user.name,
    date: new Date(),
  };
  const result = await db.collection("orders").insertOne(order);
  await db
    .collection("users")
    .updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $set: { cart: { items: [] } } },
    );
  return result;
}

export async function getOrder(userId: string) {
  const db = getDb();
  return await db
    .collection("orders")
    .find({ userId: new mongodb.ObjectId(userId) })
    .toArray()
    .then((orders: any) => {
      return orders;
    })
    .catch((err: any) => {
      console.error("Error fetching order:", err);
      throw err;
    });
}
