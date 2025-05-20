import RouterHelper from "../../helpers/router.helper.js";
import { productsManager } from "../../data/manager.mongo.js";
import passportCb from "../../middlewares/passportCb.mid.js";

const createOne = async (req, res) => {
  const data = req.body;
  const one = await productsManager.createOne(data);
  res.json201(one._id);
};
const readAll = async (req, res) => {
  const filter = req.query;
  const all = await productsManager.readAll(filter);
  if (all.length > 0) {
    res.json200(all);
  } else {
    res.json404();
  }
};
const readById = async (req, res) => {
  const { id } = req.params;
  const one = await productsManager.readById(id);
  if (one) {
    res.json200(one._id);
  } else {
    res.json404();
  }
};
const updateById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const one = await productsManager.updateById(id, data);
  if (one) {
    res.json200(one._id);
  } else {
    res.json404();
  }
};
const destroyById = async (req, res) => {
  const { id } = req.params;
  const one = await productsManager.destroyById(id);
  if (one) {
    res.json200(one._id);
  } else {
    res.json404();
  }
};

class ProductsRouter extends RouterHelper {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/", ["ADMIN"], createOne);
    this.read("/", ["PUBLIC"], readAll);
    this.read("/:id", ["PUBLIC"], readById);
    this.update("/:id", ["ADMIN"], updateById);
    this.destroy("/:id", ["ADMIN"], destroyById);
  };
}

const productsRouter = new ProductsRouter().getRouter();
export default productsRouter;
