import RouterHelper from "../../helpers/router.helper.js";
import { cartsManager } from "../../data/manager.mongo.js";
import { productsManager } from "../../data/manager.mongo.js";


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

const readAll = async (req, res, next) => {
  
    const filter = req.query;
    const all = await cartsManager.readAll(filter);
    if (all.length > 0) {
      res.json201(all);
    } else {
      res.json404("Not found");
    }
  
};


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




const readById = async (req, res, next) => {
  const { id } = req.params;
  const data = { _id: id }
  const one = await cartsManager.readBy(data);
 // console.log("one: ", one)
  if (one) {
    res.json200(one);
  } else {
    res.json404("Not found");
  }
};


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
    this.create("/", ["ADMIN"], createOne);
    this.read("/", ["PUBLIC"], readAll);
    this.read("/:id", ["PUBLIC"], readById);
    this.update("/:cid/:pid", ["ADMIN"], addProductToCart);
    this.destroy("/:id", ["ADMIN"], destroyById);
    
  };
}

const cartsRouter = new CartsRouter().getRouter();
export default cartsRouter;
