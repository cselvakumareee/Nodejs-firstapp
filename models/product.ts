import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';

const filePath = path.join(rootDir, 'data', 'products.json');

export function getProductsFromFile(): { title: string }[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    return [];
  }
}

export function product(productData?: { title: string }) {
  const title: string = productData?.title?.trim() || '';

  if (!title) {
    return [];
  }

  const products = getProductsFromFile();
  products.push({ title });
  fs.writeFileSync(filePath, JSON.stringify(products));
  return products;
}

export const actualproducts = getProductsFromFile();