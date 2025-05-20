import { connect } from "mongoose";

const dbConnect = async (url) => {
  try {
    await connect(url);
    console.log("connected to mongo database");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
