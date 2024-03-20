import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddlewere = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(req)
    if (!token) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Пользователь не авторизован" });
  }

};

export { authMiddlewere };
