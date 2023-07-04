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
});

export default router;
