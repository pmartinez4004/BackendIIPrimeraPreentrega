import jwt from "jsonwebtoken";

const createToken = (data) => {
  try {
    const token = jwt.sign(
      /* informacion a tokenizar */
      data,
      /* clave secreta, necesaria para tokenizar */
      process.env.SECRET,
      /* objeto de configuración */
      { expiresIn: 7 * 24 * 60 * 60 }
    );
    return token;
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
};
const verifyToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.SECRET);
    return data;
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
};

export { createToken, verifyToken };
