import { Router } from "express";
import { favoritesProductController } from "../controllers/favoritesProduct.controller.js";

const favoritesProductRouter = new Router();

favoritesProductRouter.post("/", favoritesProductController.addToFavorites);
favoritesProductRouter.get("/", favoritesProductController.getFavoritesProduct);
favoritesProductRouter.delete("/:productId", favoritesProductController.delete);

export { favoritesProductRouter };
