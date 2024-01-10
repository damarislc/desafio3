//imports de la clase ProductManager y express
import ProductManager from "./ProductManager.js";
import express from "express";

//Declaracion del puerto y de la clase product manager
const port = 8080;
const productManager = new ProductManager();

//Declaracion de la aplicacion express
const app = express();

/**
 * Get que devuelve la lista de todos los productos del archivo si no se
 * incluye un limte. Modo de ejecucion: http://localhost:8080/products
 * Si incluye un limite por medio de query, devuelve solo los productos
 * requeridos. Modo de ejecucion: http://localhost:8080/products?limit=1
 */
app.get("/products", (req, res) => {
  //obtiene todos los productos
  let products = productManager.getProducts();
  //obtiene el "limit" desde el query request
  let limit = parseInt(req.query.limit);

  /**
   * Si limit no es un numero o
   * es igual o menor a 0 o
   * el limite otorgado es mayor al arreglo de productos,
   * devuelve todos los productos.
   */
  if (isNaN(limit) || limit <= 0 || limit > products.length)
    return res.json(products);

  /**
   * Si no entro al if anterior quiere decir que contiene un
   * limite correcto, por lo que crea un nuevo arreglo desde
   * la posicion 0 hasta el limite de productos solicitados
   * y los regresa en formato de json.
   */
  let productosLimitados = products.slice(0, limit);
  res.json(productosLimitados);
});

/**
 * Get que devuelve el producto con el id solicitado.
 * Modo de ejecucion: http://localhost:8080/products/1
 */
app.get("/products/:pid", (req, res) => {
  let pid = parseInt(req.params.pid);
  let product = productManager.getProductById(pid);
  res.json(product);
});

//Crea la conexion del servidor
app.listen(port, () => console.log("Servidor en el puerto", port));
