import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import https from "https";
import fs from "fs";

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

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use(cors());
app.use("/api", router);

// middleware для ошибок регестрируется в конце (т.к. он посленний в нем не вызывается next)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Working" });
});

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/olgayudina.ru/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/olgayudina.ru/fullchain.pem'),
};

const server = https.createServer(httpsOptions, app);

const startApp = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

startApp();