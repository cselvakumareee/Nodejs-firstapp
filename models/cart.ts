import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';
const filePath = path.join(rootDir, 'data', 'cart.json');

export type CartProduct = { id: string; qty: number };
type Cart = { products: CartProduct[]; totalPrice: number };

export function getCartsFromFile() {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent ? JSON.parse(fileContent) : [];
      } catch (error) {
        return [];
      }
}

export function getCart () {
    const cart = getCartsFromFile();
    return cart;
}

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

        const existingProductIndex = cart.products.findIndex(p => p.id === productId);
        const existingProduct = cart.products[existingProductIndex];

        if (existingProduct) {
            const updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            cart.products.push({ id: productId, qty: 1 });
        }

        cart.totalPrice = +(cart.totalPrice + +productPrice);

        fs.writeFile(filePath, JSON.stringify(cart), (err) => {
            if (err) {
                console.log('Cart write error:', err);
            }
        });
    });
}

export function deleteCart(id: string, price: number) {
    const cart = getCartsFromFile();
    const updatedCart = {...cart};
    const product = updatedCart.products.find((prod: CartProduct) => prod.id === id);
    if(!product) {
        return;
    }
    const prodQty = product.qty;
    updatedCart.products = updatedCart.products.filter((prod: CartProduct) => prod.id !== id);
    updatedCart.totalPrice = updatedCart.totalPrice - (prodQty *price);
    // con  st updatedCart = {...cart.products.filter((prod: CartProduct) => prod.id !== id)};
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