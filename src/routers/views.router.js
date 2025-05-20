import RouterHelper from "../helpers/router.helper.js";
import { productsManager } from "../data/manager.mongo.js";
import { cartsManager } from "../data/manager.mongo.js";

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
const profileViewCb = async (req, res) => {
  const products = await productsManager.readAll();
  res.status(200).render("profile", { products });
};

/*const cartViewCb = async (req, res) => {
  const products = await productsManager.readAll();
  res.status(200).render("cart", { title: "CART", carts, total: total[0].total });
};*/
/*const cartViewCb = async (req, res) => {
  const { pid } = req.params;

  const data = { user_id: pid }
  const one = await cartsManager.readBy(data);

  //const data = { user_id: pid }
  console.log("one: ",one)

 // const carts = await cartsManager.readById(data);
  console.log("carts:",JSON.stringify(one))
  res.status(200).render("carts", { title: "CART", carts:one});
}*/

/*const cartViewCb = async (req, res) => {
  const { pid } = req.params
  const cart = await cartsManager.readBy({ _id: pid });
  console.log("cart",JSON.stringify(cart))
  res.status(200).render("profile", { cart });
};*/

const cartViewCb = async (req, res) => {
const { pid } = req.params; 
console.log("cid=",pid)  
    const cart = await cartsManager.readById({ _id: pid })
    res.render("carts", { cart });
}
/*
    try {
        const { pid } = req.params;

        // Buscar el carrito del usuario
        const data = { _id: pid };
        const one = await cartsManager.readBy({ pid })
      console.log("one",one)
        if (!one) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        console.log("Carrito encontrado:", JSON.stringify(one, null, 2));

        // Pasar el carrito como arreglo para Handlebars
        res.status(200).render("cart", { title: "CART", carts: one });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};*/

/*viewsRouter.get("/carts/:cid", async(req, res)=> {
  try {
    
    const { cid } = req.params;   
    const cart = await cartModel.find({ _id: cid }).lean()
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al recuperar carritos: ${error.message}` });
  }
});*/




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
    this.render("/profile", ["USER", "ADMIN"], profileViewCb);
    this.render("/carts/:pid", ["PUBLIC"], cartViewCb);
  };
}

const viewsRouter = new ViewsRouter().getRouter();
export default viewsRouter;
