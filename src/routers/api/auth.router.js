import RouterHelper from "../../helpers/router.helper.js";
import { usersManager } from "../../data/manager.mongo.js";
//import passport from "../../middlewares/passport.mid.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import { verifyToken } from "../../helpers/token.util.js";

const registerCb = async (req, res) => res.json201(null, "Registered");
const loginCb = async (req, res) => {
  const opts = { maxAge: 7 * 24 * 60 * 60 * 1000, signed: true };
  res.cookie("token", req.user.token, opts).json200(req.user._id, "Logged in");
};
const signoutCb = (req, res) =>
  res.clearCookie("token").json200(req.user._id, "Signed out");
const onlineCb = async (req, res) => {
  const { token } = req.signedCookies;
  const dataToken = verifyToken(token);
  let user = await usersManager.readById(dataToken?._id);
  if (!user) {
    return res.json401("Invalid credentials");
  }
  const { password, __v, createdAt, updatedAt, ...rest } = user;
  res.json200(rest);
};
const badAuthCb = (req, res) => res.json401();
const forbiddenCb = (req, res) => res.json403();

class AuthRouter extends RouterHelper {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/register", ["PUBLIC"], passportCb("register"), registerCb);
    this.create("/login", ["PUBLIC"], passportCb("login"), loginCb);
    this.create("/signout", ["USER", "ADMIN"], signoutCb);
    this.create("/online", ["USER", "ADMIN"], onlineCb);
    this.read("/bad-auth", ["PUBLIC"], badAuthCb);
    this.read("/forbidden", ["PUBLIC"], forbiddenCb);
    this.read(
      "/google",
      ["PUBLIC"],
      passportCb("google", { scope: ["email", "profile"] })
    );
    this.read("/google/redirect", ["PUBLIC"], passportCb("google"), loginCb);
  };
}

const authRouter = new AuthRouter().getRouter();
export default authRouter;
