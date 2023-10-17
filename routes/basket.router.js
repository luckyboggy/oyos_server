import { Router } from "express";
import { basketController } from "../controllers/basket.controller.js";

const basketRouter = new Router();

basketRouter.get("/", basketController.getBasket);

export { basketRouter };
