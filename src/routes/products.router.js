import { Router } from "express";
import ProductManager from "../dao/dbManagers/productManager.js";

const router = Router();
const productManager = new ProductManager();

// **GET**
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    if (!products) {
      return res.status(404).send({
        status: "Error",
        message: { error: "No products found" },
      });
    } else {
      return res.status(200).send({ status: "Success", payload: products });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const search = await productManager.getById(pid);

    if (!search || search == 0) {
      return res.status(404).send({
        status: "Error",
        message: { error: `Cannot find product with ID : ${pid}` },
      });
    } else {
      return res.status(200).send({
        status: "Success",
        payload: search,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// **POST**
router.post("/", async (req, res) => {
  try {
    let { title, description, code, price, stock, category } = req.body;

    const newProduct = {
      title,
      description,
      code,
      price,
      stock,
      category,
    };

    const productAdded = await productManager.addProduct(newProduct);

    if (!productAdded) {
      return res.status(400).send({
        status: "Error",
        message: { error: "Cannot add new product" },
      });
    } else {
      return res.status(201).send({
        status: "Success",
        payload: productAdded,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// **PUT**
router.put("/:pid", async (req, res) => {
  try {
    const updateBody = req.body;
    const productId = req.params.pid;
    if (!updateBody || !productId) {
      return res.status(400).send({
        status: "Error",
        message: { error: "Please complete Update Body & Product ID values" },
      });
    } else {
      const updatedProduct = await productManager.updateProduct(
        productId,
        updateBody
      );
      return res.status(200).send({
        status: "Success",
        payload: updatedProduct,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// **DELETE**
router.delete("/:pid", async (req, res) => {
  try {
    const deleteId = req.params.pid;

    if (!deleteId) {
      return res.status(400).send({
        status: "Error",
        message: { error: "Incomplete values" },
      });
    } else {
      const deletedProduct = await productManager.deleteProduct(deleteId);
      if (deletedProduct.deletedCount === 0) {
        return res.status(404).send({
          status: "Error",
          error: "cannot find product id",
        });
      } else {
        return res.status(200).send({
          status: "Success",
          payload: deletedProduct,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
