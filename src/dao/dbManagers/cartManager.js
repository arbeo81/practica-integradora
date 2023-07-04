import { cartModel } from "../../dao/models/cart.model.js";
import { productModel } from "../models/product.model.js";

export default class CartManager {
  constructor() {}
  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  };
  getCartById = async (cartId) => {
    try {
      const cartById = await cartModel.find({ _id: cartId });
      return cartById;
    } catch (error) {
      console.log(error);
    }
  };
  createCart = async (cart) => {
    try {
      const newCart = await cartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };
  addToCart = async (cartId, productId, quantity) => {
    try {
      const cartFound = await cartModel.findOne({ _id: cartId });
      const prodcarIndex = cartFound.products.findIndex(
        (product) => product.__id == productId
      );
      if (prodcarIndex !== -1) {
        const updatedCart = await cartModel.updateOne(
          { _id: cartId, products: { $elemMatch: { _id: productId } } },
          { $inc: { quantity: (quantity += quantity) } }
        );
        return updatedCart;
      } else {
        const prodMod = await productModel.find({ _id: productId });
        for (const { title, description, price } of prodMod) {
          const prodToAdd = {
            _id: productId,
            title,
            description,
            price,
            quantity,
          };
          const cartUpdate = await cartModel.updateOne(
            { _id: cartId },
            { $push: { products: prodToAdd } }
          );
          return cartUpdate;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  deleteFromCart = async (cartId, productId) => {
    try {
      const cartFound = await cartModel.findOne({ _id: cartId });
      if (!cartFound) {
        return new Error("Cart not found");
      } else {
        const cartPull = await cartModel.updateOne(
          { _id: cartId },
          { $pull: { products: { _id: productId } } }
        );
        return cartPull;
      }
    } catch (error) {
      console.log(error);
    }
  };
}
