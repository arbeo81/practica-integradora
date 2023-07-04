import { productModel } from "../models/product.model.js";

export default class ProductManager {
  constructor() {}
  getProducts = async () => {
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  };
  getById = async (productId) => {
    try {
      const search = await productModel.find({ _id: productId });
      return search;
    } catch (error) {
      console.log(error);
    }
  };
  addProduct = async (product) => {
    try {
      product.stock > 0
        ? (product = { status: true, ...product })
        : (product = { status: false, ...product });

      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  };
  updateProduct = async (productId, updateProduct) => {
    try {
      const updatedProduct = await productModel.updateOne(
        { _id: productId },
        updateProduct
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  };
  deleteProduct = async (deleteId) => {
    try {
      const deletedProduct = await productModel.deleteOne({ _id: deleteId });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  };
}

