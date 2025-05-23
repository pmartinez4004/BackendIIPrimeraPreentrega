import RouterHelper from "../../helpers/router.helper.js";
import { cartsManager } from "../../data/manager.mongo.js";
import { productsManager } from "../../data/manager.mongo.js";

// Crear carrito
const createOne = async (req, res) => {
  const { _id } = req.user;
  const { products } = req.body
  const response = await cartsManager.createOne({
    user_id: _id,
    products
  });
  const formattedResponse = JSON.parse(JSON.stringify(response));
  res.json201(formattedResponse);
};

// Leer todos los carritos
const readAll = async (req, res, next) => {
  const filter = req.query;
  const all = await cartsManager.readAll(filter);
  if (all.length > 0) {
    res.json201(all);
  } else {
    res.json404("Not found");
  }
};

// Agregar a un carrito un producto
const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartsManager.readById({ _id: cid });
  const productToAdd = await productsManager.readById({ _id: pid });
  const productIndex = cart.products.findIndex(
    item => item.product_id._id.toString() === productToAdd._id.toString()
  );

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({
      product_id: productToAdd,
      quantity: 1
    });
  }
  await cartsManager.updateById(cid, { products: cart.products }, { new: true });
  res.status(200).send({ status: "success", payload: cart });
};


// Borrar de un carrito un producto
const deleteProductFromCart = async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;
  const cart = await cartsManager.readBy({ _id: cid });
  const product = await productsManager.readBy({ _id: pid })
  const filter = cart.products.filter((item) => item.product_id._id.toString() !== product._id.toString());
  await cartsManager.updateById({ _id: cid }, { products: filter });
  res.status(200).send({ status: "success", payload: cart });
}

// Vaciar el contenido de un carrito
const emptyCart = async (req, res) => {
  const { cid } = req.params;
  const update = { products: [] };
  const updatedCart = await cartsManager.updateById({ _id: cid }, update);
  res.status(200).send({ status: "success", payload: updatedCart });
}

// Leer un carrito
const readById = async (req, res, next) => {
  const { id } = req.params;
  const data = { _id: id }
  const one = await cartsManager.readBy(data);
  if (one) {
    res.json200(one);
  } else {
    res.json404("Not found");
  }
};

// Borrar un carrito
const destroyById = async (req, res, next) => {
  const { id } = req.params;
  const one = await cartsManager.destroyById(id);
  if (one) {
    res.json200(one);
  } else {
    res.json404("Not found");
  }
};

class CartsRouter extends RouterHelper {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/", ["ADMIN", "USER"], createOne);
    this.read("/", ["PUBLIC"], readAll);
    this.read("/:id", ["PUBLIC"], readById);
    this.update("/:cid/:pid", ["ADMIN", "USER"], addProductToCart);
    this.destroy("/:id", ["ADMIN", "USER"], destroyById);
    this.destroy("/:cid/:pid", ["USER", "ADMIN"], deleteProductFromCart);
    this.update("/:cid", ["USER", "ADMIN"], emptyCart);

  };
}

const cartsRouter = new CartsRouter().getRouter();
export default cartsRouter;
