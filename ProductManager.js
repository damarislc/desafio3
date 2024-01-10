const fs = require("fs");

/**
 * Clase ProductManager
 * Contiene un arreglo de objetos.
 * El objeto debe contener los campos: title, description, price, thumbnail, code, stock
 * Consta de los siguientes métodos:
 * *addProduct - Añade productos al arreglo, recibe un objeto
 * *getProduct - Devuelve el arreglo de objetos
 * *getProductById - Devuelve el objeto según su Id
 * *updateProduct - Actualiza el objeto con los datos de otro objeto
 * *deleteProduct - Borrar el objeto según su Id
 */
class ProductManager {
  /**
   * Constructor que inicializa el arreglo vacío y el path del json
   */
  constructor() {
    this.products = [];
    this.path = "productos.json";
  }

  /**
   * Método addProduct, manda a llamar el método getProducts para obtener los productos
   * desde el JSON y buscar si ya existe el producto, si ya existe, no lo agrega.
   * Si no existe, lo añade al arreglo y el archivo JSON.
   * @param {*} es un objeto desestructurado
   * @returns none
   */
  //addProduct({ title, description, price, thumbnail, code, stock }) {
  addProduct(newProduct) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    this.getProducts();
    /*Si el codigo del producto y titulo ya existen, manda mensaje de que el producto ya existe 
    y no lo agrega */
    if (
      this.products.some((product) => product.code === newProduct.code) &&
      this.products.some((product) => product.title === newProduct.title)
    ) {
      console.log(
        `El producto "${newProduct.title}" ya existe, no se agregará a la lista.`
      );
      return;
    }
    //Si el codigo del producto ya existe manda un mensaje para que se cambie el código.
    if (this.products.some((product) => product.code === newProduct.code)) {
      console.log(
        `El codigo "${newProduct.code}" ya existe, favor de cambiarlo en el producto "${newProduct.title}".`
      );
      return;
    }
    //Si hay campos vacíos, manda un mensaje para que se completen todos los campos.
    if (
      !(
        newProduct.title &&
        newProduct.description &&
        newProduct.price &&
        newProduct.thumbnail &&
        newProduct.code &&
        newProduct.stock
      )
    ) {
      console.log(
        `Favor de llenar todos los campos en el producto "${newProduct.title}"`
      );
      return;
    }

    //Crea el id para el nuevo producto
    const id = this.setId();
    //añade el nuevo producto con el id al arreglo
    this.products.push({ id, ...newProduct });

    //Crea al archivo JSON con el contenido del arreglo.
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log("Datos guardados correctamente en el archivo", this.path);
    } catch (error) {
      console.error("Error al escribir en el archivo", error);
    }
  }

  /**
   * Método getProducts para obtener el arreglo de todos los productos,
   * lee el archivo json y luego parsea los datos al arreglo.
   * @returns el arreglo de productos
   */
  getProducts() {
    try {
      //Lee el archivo JSON
      const data = fs.readFileSync(this.path);
      //Parsea el contenido y lo asigna al arreglo de la clase
      this.products = JSON.parse(data);
      console.log("Archivo leido exitosamente.");
    } catch (error) {
      console.error("Error al leer el archivo,");
      //Si da un error -4058 es que el archivo no existe
      if (error.errno === -4058) console.error("El archivo no existe.");
      //cualquier otro error, muestra el mensaje de dicho error.
      else console.error(error);
    }

    return this.products;
  }

  /**
   * Método getProductById para obtener el producto según su id. Obtiene primero todos los productos
   * para popular el arreglo desde el archivo y luego buscar el objeto por el id.
   * @param {*} id
   * @returns regresa el producto si lo encuentra o un mensaje de que no lo encontró.
   */
  getProductById(id) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    this.getProducts();
    //Busca el objeto segun el id
    const product = this.products.find((product) => product.id === id);
    //si el producto es undefined es que no existe y duelve un mensaje, sino regresa el objeto.
    return product === undefined
      ? `El producto con el id ${id} no existe`
      : product;
  }

  /**
   * Método para actualizar un objeto
   * @param {*} id el id del objeto a actualizar
   * @param {*} productUpdated el objeto con el/los campos modificados
   * @returns none
   */
  updateProduct(id, productUpdated) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    this.getProducts();

    //Si el id no existe, muestra un mensaje de error y se sale del método
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(
        `El id ${id} no existe, no se puede actualizar el producto.`
      );
      return;
    }

    //Obtiene el index en el array del objeto con el id a actualizar
    const objIndex = this.products.findIndex((product) => product.id === id);
    //Cambia el objeto en el índice encontrado por el nuevo objeto con el id que tenía.
    this.products[objIndex] = { id, ...productUpdated };

    //Reescribe el archivo con el objeto actualizado
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log("Datos actualizados correctamente en el archivo", this.path);
    } catch (error) {
      console.error("Error al actualizar en el archivo", error);
    }
  }

  /**
   * Método para eliminar un producto según su id.
   * @param {*} id el id del producto a eliminar
   * @returns none
   */
  deleteProduct(id) {
    //Obtiene todos los productos desde el JSON y los añade al arreglo
    this.getProducts();

    //Si el id no existe, muestra un mensaje de error y se sale del método
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(`El id ${id} no existe, no se puede eliminar el producto.`);
      return;
    }

    //Obtiene el index en el array del objeto con el id a eliminar
    const objIndex = this.products.findIndex((product) => product.id === id);
    this.products.splice(objIndex, 1);

    //Reescribe el archivo con el objeto borrado
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log("Objeto borrado correctamente en el archivo", this.path);
    } catch (error) {
      console.error("Error al actualizar en el archivo", error);
    }
  }

  /**
   * Método para crear el id autoincremental.
   * @returns el nuevo id para el objeto.
   */
  setId() {
    this.lastId = this.getLastProductId();
    if (this.lastId === 0) this.lastId = 1;
    else this.lastId++;
    return this.lastId;
  }

  /**
   * Método para obtener el último id del arreglo, si el arreglo no
   * tiene ningún objeto, devuelve 0.
   * @returns el último id de product o 0
   */
  getLastProductId() {
    if (this.products.length === 0) return 0;
    const lastProductId = this.products[this.products.length - 1].id;
    console.log("Last product id=", lastProductId);
    return lastProductId;
  }
}

/************************ TESTS *****************************/

//Los tests que utilicé para probar el código, descomentar si se quieren reutilizar.

/* const productM = new ProductManager();
console.log(productM.getProducts());
const product1 = {
  title: "Mi producto 1",
  description: "Descripcion",
  price: "123",
  thumbnail: "mi imagen",
  code: "abc",
  stock: 5,
};
productM.addProduct(product1);

const product2 = {
  title: "Mi producto 2",
  description: "Descripcion",
  price: "456",
  thumbnail: "mi imagen",
  code: "123",
  stock: 3,
};

productM.addProduct(product2);

const product3 = {
  title: "Mi producto 3",
  description: "Descripcion",
  price: "789",
  thumbnail: "mi imagen",
  code: "def",
  stock: 10,
};

productM.addProduct(product3);

product3.title = "Este es el nuevo titulo del producto";
productM.updateProduct(3, product3);

console.log("Los productos son:", productM.getProducts());

console.log("****Product by id******");
console.log(productM.getProductById(2));
console.log(productM.getProductById(5));

******* DELETE PRODCUT ********

productM.deleteProduct(2);

console.log("Los productos son:", productM.getProducts()); */
