import RouterHelper from "../helpers/router.helper.js";
import { productsManager } from "../data/manager.mongo.js";
import { cartsManager } from "../data/manager.mongo.js";
import { usersManager } from "../data/manager.mongo.js";

const homeViewCb = async (req, res) => {
  const products = await productsManager.readAll();
  res.status(200).render("index", { products });
};
const productViewCb = async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.readById(pid);
  res.status(200).render("product", { product });
};
const registerViewCb = async (req, res) => {
  const products = await productsManager.readAll();
  res.status(200).render("register", { products });
};
const loginViewCb = async (req, res) => {
  const products = await productsManager.readAll();
  res.status(200).render("login", { products });
};

// Mostrar carrito
const cartViewCb = async (req, res) => {
  const { pid } = req.params;
  const cart = await cartsManager.readById({ _id: pid })
  cart.products.forEach(product => {
    product.subtotal = product.product_id.price * product.quantity; // Calcula subtotal
  });

  const totalQuantity = cart.products.reduce((sum, product) => sum + product.quantity, 0);
  const totalAmount = cart.products.reduce((sum, product) => sum + product.subtotal, 0);

  res.render("carts", { cart, totalQuantity, totalAmount });
}

// Mostrar perfil
const profileViewCb = async (req, res) => {
  const { uid } = req.params;
  const profile = await usersManager.readById({ _id: uid })
  res.render("profile", { profile });
}


class ViewsRouter extends RouterHelper {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.render("/", ["PUBLIC"], homeViewCb);
    this.render("/product/:pid", ["PUBLIC"], productViewCb);
    this.render("/register", ["PUBLIC"], registerViewCb);
    this.render("/login", ["PUBLIC"], loginViewCb);
    this.render("/profile/:uid", ["USER", "ADMIN"], profileViewCb);
    this.render("/carts/:pid", ["PUBLIC"], cartViewCb);

  };
}

const viewsRouter = new ViewsRouter().getRouter();
export default viewsRouter;
