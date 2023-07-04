import fs from "fs";
import __dirname from "./utils.js";
import { Blob } from "buffer";
// importamos el socket para escuchar del lado servidor
import socket from "./socket.js";

export default class ProductManager {
  constructor() {
    this.dir = `./files`;
    this.path = `./files/products.json`;
  }
  getProducts = async () => {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      if (fs.existsSync(this.path)) {
        const productData = await fs.promises.readFile(this.path, "utf-8");
        const size = new Blob([productData]).size;
        if (size > 0) {
          const parsedProducts = JSON.parse(productData);
          return parsedProducts;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };
  addProduct = async (product) => {
    // despues de guardar archivo, emitir evento
    try {
      product.stock > 0
        ? (product = { status: true, ...product })
        : (product = { status: false, ...product });

      const products = await this.getProducts();
      const productIndex = await products.findIndex(
        (prod) => prod.code === product.code
      );

      if (productIndex === -1) {
        products.length === 0
          ? (product = { id: 1, ...product })
          : (product = {
              id: products[products.length - 1].id + 1,
              ...product,
            });
        products.push(product);
        // Aca se crea el archivo
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        // justo despues emitimos el evento, aqui elegimos el nombre
        // "product_added", y se envia como informacion el product
        socket.io.emit("product_added", product);
        return product;
      }
    } catch (error) {
      console.log(error);
    }
  };
  #codeIndex = (array, code) => {
    const codeIndex = array.findIndex((product) => product.code === code);
    return codeIndex;
  };
  findProduct = async (productId) => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const result = JSON.parse(data);

      const productIndex = result.findIndex(
        (product) => product.id === productId
      );
      if (productIndex === -1) {
        console.error(`The Product with ID : "${productId}" does not exist.`);
        return productIndex;
      } else {
        return productIndex;
      }
    }
  };
  getProductById = async (productId) => {
    try {
      const search = await this.findProduct(productId);
      const products = await this.getProducts();
      return products[search];
    } catch (error) {
      console.log(error);
    }
  };
  deleteProduct = async (productId) => {
    const parsedId = Number(productId);
    const search = await this.findProduct(parsedId);
    const products = await this.getProducts();

    if (search === -1) {
      return;
    } else {
      try {
        products.splice(search, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        socket.io.emit("product_deleted", search);

        return console.log("Product deleted successfully !");
      } catch (error) {
        console.log(error);
      }
    }
  };
  updateProduct = async (productId, update) => {
    try {
      const products = await this.getProducts();
      const parsedId = Number(productId);
      const productUpdateId = await this.findProduct(parsedId);

      if (productUpdateId !== -1) {
        const productUpdate = { ...products[productUpdateId], ...update };
        products[productUpdateId] = productUpdate;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
      } else {
        return productUpdateId;
      }
    } catch (error) {
      console.log(error);
    }
  };
}