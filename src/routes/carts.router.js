import { Router } from "express";
import CartManager from "../dao/dbManagers/cartManager.js";

const router = Router();

const cartManager = new CartManager();

// **GET**
router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  return res.send({ status: "Sucess", payload: carts });
});
// **POST**
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).send({ status: "Success", payload: newCart });
  } catch (error) {
    console.log(error);
  }
});
// **UPDATE**
router.put("/:cid/:pid-:qty", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.params.qty;

    const cartUpdate = await cartManager.addToCart(cartId, prodId, quantity);
    if (!cartUpdate) {
      return res.status(400).send({
        status: "Error",
        message: { error: "incomplete or wrong params" },
      });
    } else {
      return res.status(200).send({
        status: "Success",
        payload: cartUpdate,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// **DELETE**
router.delete("/:cid/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const deleteFromCart = await cartManager.deleteFromCart(cartId, prodId);
    return res.status(200).send({
      status: "Success",
      payload: deleteFromCart,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
