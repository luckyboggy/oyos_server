import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

import { sequelize } from "./db.js";
import {
  Address,
  User,
  Basket,
  Order,
  Favorites,
  BasketProduct,
  OrderProduct,
  FavoritesProduct,
  Product,
  ProductSize,
  ProductInfo,
  Type,
  Collection,
} from "./models/models.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandlingMiddleware.js";

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;
const ADDRESS = process.env.ADDRESS || "127.0.4.243";

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use(cors());
app.use("/api", router);

// middleware для ошибок регестрируется в конце (т.к. он посленний в нем не вызывается next)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Work!!!" });
});

const startApp = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // development
    // app.listen(5000, () =>
    //   console.log(`Server has been started on port ${PORT}`)
    // );
    // production
    app.listen(PORT, ADDRESS, () =>
      console.log(`Server has been started on port ${PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

startApp();
