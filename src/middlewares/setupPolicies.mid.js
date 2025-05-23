import { usersManager } from "../data/manager.mongo.js";
import { verifyToken } from "../helpers/token.util.js";

const setupPolicies = (policies) => async (req, res, next) => {
  try {
    if (policies.includes("PUBLIC")) return next();
    const token = req?.signedCookies?.token;
    const data = verifyToken(token);
    const { user_id, role } = data;
    if (!data._id) return res.json401();
    const roles = {
      USER: policies.includes("USER"),
      ADMIN: policies.includes("ADMIN"),
    };
    const verifyRole = roles[role];
    if (!verifyRole) return res.json403();
    const user = await usersManager.readById(data._id);
    const { password, __v, createdAt, updatedAt, ...rest } = user;
    req.user = rest;
    next();
  } catch (error) {
    next(error);
  }
};

export default setupPolicies;
