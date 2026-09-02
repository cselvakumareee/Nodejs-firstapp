import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';
import { getDb } from '../util/database';
const filePath = path.join(rootDir, 'data', 'cart.json');

export type CartProduct = { _id: string; qty: number };
type Cart = { products: CartProduct[]; totalPrice: number };

/** Reads the cart data from the local JSON file. */
export function getCartsFromFile() {
    const db = getDb();
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent ? JSON.parse(fileContent) : [];
      } catch (error) {
        return [];
      }
}

/** Returns the current cart contents. */
export function getCart () {
    const cart = getCartsFromFile();
    return cart;
}

/**
 * Adds one unit of a product to the local cart and updates its total price.
 *
 * @param productId - The product identifier to add.
 * @param productPrice - The unit price used to update the cart total.
 */
export function addProduct(productId: string, productPrice: number): void {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        let cart: Cart = { products: [], totalPrice: 0 };
        if (!err && fileContent) {
            try {
                cart = JSON.parse(fileContent) as Cart;
            } catch (_) {
                cart = { products: [], totalPrice: 0 };
            }
        }

        const existingProductIndex = cart.products.findIndex(p => p._id === productId);
        const existingProduct = cart.products[existingProductIndex];

        if (existingProduct) {
            const updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            cart.products.push({ _id: productId, qty: 1 });
        }

        cart.totalPrice = +(cart.totalPrice + +productPrice);

        fs.writeFile(filePath, JSON.stringify(cart), (err) => {
            if (err) {
                console.log('Cart write error:', err);
            }
        });
    });
    // const db = getDb();
    // db.collection('cart').insertOne({productId, productPrice })
    // .then((result: any) => {
    //   console.log('cart inserted:', result.insertedId);
    // })
    // .catch((err: any) => {
    //   console.error('Error inserting cart:', err);
    // });
}

/**
 * Removes a product from the local cart and subtracts its total cost.
 *
 * @param _id - The product identifier to remove.
 * @param price - The product's unit price.
 */
export function deleteCart(_id: string, price: number) {
    const cart = getCartsFromFile();
    const updatedCart = {...cart};
    const product = updatedCart.products.find((prod: CartProduct) => prod._id === _id);
    if(!product) {
        return;
    }
    const prodQty = product.qty;
    updatedCart.products = updatedCart.products.filter((prod: CartProduct) => prod._id !== _id);
    updatedCart.totalPrice = updatedCart.totalPrice - (prodQty *price);
    // con  st updatedCart = {...cart.products.filter((prod: CartProduct) => prod._id !== _id)};
    fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
            if (err) {
                console.log('Cart delete error:', err);
            }
        });
}

// export function getCart(callback: (cart: Cart | null) => void): void {
//     fs.readFile(filePath, 'utf8', (err, fileContent) => {
//         if (err) {
//             // no cart yet or read error
//             return callback(null);
//         }
//         try {
//             const cart = JSON.parse(fileContent) as Cart;
//             callback(cart);
//         } catch (_) {
//             callback(null);
//         }
//     });
// }