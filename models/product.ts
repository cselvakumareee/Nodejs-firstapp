import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';

const filePath = path.join(rootDir, 'data', 'products.json');

export function getProductsFromFile(): { title: string; imageUrl?: string; description?: string; price?: number, id?: string }[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    return [];
  }
}

export function getProductById(productId: string): { title: string; imageUrl?: string; description?: string; price?: number, id?: string } | undefined {
  const products = getProductsFromFile();
  return products.find((prod) => prod.id === productId);
}

export function product(productData?: { title: string; imageUrl?: string; description?: string; price?: number }) {
  const title: string = productData?.title?.trim() || '';
  const imageUrl: string = productData?.imageUrl?.trim() || '';
  const description: string = productData?.description?.trim() || '';
  const price = productData?.price || 0;
  if (!title) {
    return [];
  }

  const products = getProductsFromFile();
  const id = Math.random().toString();
  products.push({ title, imageUrl, description, price, id });
  fs.writeFileSync(filePath, JSON.stringify(products));
  return products;
}

export function editProduct(productId: string, title: string, imageUrl?: string, description?: string, price?: number){
  const products = getProductsFromFile();
  const existingProductIndex = products.findIndex(product => product.id === productId);
  const existingProduct = products[existingProductIndex];
  if(existingProduct){
    const updateProduct = {...existingProduct, title: title, imageUrl: imageUrl, description: description, price: price};
    products[existingProductIndex] = updateProduct;
  }
  fs.writeFileSync(filePath, JSON.stringify(products));
}

export function deleteProduct(productId: string) {
  const products = getProductsFromFile();
  const existingProductIndex = products.findIndex(product => product.id === productId);
  if(existingProductIndex){

  }
  const updatedProducts = products.filter(product => product.id !== productId);
  fs.writeFileSync(filePath, JSON.stringify(updatedProducts));
}

export const actualproducts = getProductsFromFile();