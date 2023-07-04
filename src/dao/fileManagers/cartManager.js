import fs from "fs";
import { Blob } from "buffer";
export default class CartManager {
  constructor() {
    this.dir = "./files";
    this.path = "./files/cart.json";
  }
  getCarts = async () => {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      if (fs.existsSync(this.dir)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const size = new Blob([data]).size;
        if (size > 0) {
          const result = JSON.parse(data);
          return result;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Cannot read the file ${this.path} : ${error}`);
    }
  };
  createCart = async () => {
    try {
      const newCart = {
        id: 0,
        products: [],
      };
      const carts = await this.getCarts();

      carts.length === 0
        ? (newCart.id = 1)
        : (newCart.id = carts[carts.length - 1].id + 1);

      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  };
  getCartById = async (cartId) => {
    try {
      const carts = await this.getCarts();
      const cartById = await carts.filter((cart) => cart.id === Number(cartId));
      return cartById;
    } catch (error) {
      console.log(error);
    }
  };
  addToCart = async (cartId, productId, increaseQuantity) => {
    try {
      const checkQuantity = () => {
        if (
          !increaseQuantity ||
          isNaN(increaseQuantity) ||
          increaseQuantity == 0
        ) {
          return 1;
        } else {
          return increaseQuantity;
        }
      };
      const productAdd = {
        id: Number(productId),
        quantity: checkQuantity(),
      };
      const carts = await this.getCarts();

      const cartIndex = carts.findIndex((cart) => cart.id === Number(cartId));
      const prodIndex = carts[cartIndex].products.findIndex(
        (prod) => prod.id === Number(productId)
      );

      if (cartIndex !== -1) {
        if (prodIndex !== -1) {
          if (isNaN(increaseQuantity) || increaseQuantity <= 0) {
            carts[cartIndex].products[prodIndex].quantity++;
          } else {
            carts[cartIndex].products[prodIndex].quantity +=
              Number(increaseQuantity);
          }
        } else {
          carts[cartIndex].products.push(productAdd);
        }
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, "\t")
        );
      } else {
        throw new Error(`Cart with ID : ${cartId} was not found`);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
