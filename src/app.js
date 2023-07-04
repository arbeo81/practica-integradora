import express from "express";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import mongoose from "mongoose";
//import dotenv from "dotenv";
//dotenv.config({path:'.env'});
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const port = 8080; 
//const dbName = process.env.DB_NAME;
//const dbUser = process.env.DB_USER;
//const dbPasword = process.env.DB_PASSWORD;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

mongoose.connect("mongodb+srv://jarbeo:Janise3423@cluster0.orjlcud.mongodb.net/PracticaIntegradora")
