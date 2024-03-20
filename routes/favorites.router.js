import { Router } from "express";
import { favoritesController } from "../controllers/favorites.controller.js";

const favoritesRouter = new Router();

favoritesRouter.get("/", favoritesController.getFavorites);

export { favoritesRouter };
