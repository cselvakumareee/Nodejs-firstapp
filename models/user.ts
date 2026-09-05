import { TypeProduct } from "./product";
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product: TypeProduct) {
  const user = this;
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
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  user.cart = updatedCart;
  return user.save().catch((err: any) => {
    console.error("Error saving user cart:", err);
  });
};

userSchema.methods.deleteCart = function (productId: string) {
  const user = this;
  const cartItems = user.cart.items.filter(
    (item: { productId: string; quantity: number }) =>
      item.productId.toString() !== productId,
  );
  user.cart.items = cartItems;
  return user.save().catch((err: any) => {
    console.error("Error saving user cart:", err);
  });
};

userSchema.methods.clearCart = function () {
  const user = this;
  user.cart.items = [];
  return user.save().catch((err: any) => {
    console.error("Error clearing user cart:", err);
  });
};
export const User = mongoose.model("User", userSchema);
