import { Router } from "express";
import ProductManager from "../dao/dbManagers/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const productsArray = await productManager.getProducts();
    if (!productsArray) {
      return res
        .status(400)
        .send({ status: "Error", message: "No products found" });
    } else {
      return res.render("home", { productsArray });
    }
  } catch (error) {
    console.log(error);
  }
  router.get("/realtimeproducts", async (req, res) => {
    try {
      const products = await productModel.find().lean().exec()
      res.render('realTimeProducts', { products })
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', error: error.message })
    }
  })

});

export default router;
