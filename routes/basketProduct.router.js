import { Router } from "express";
import { basketProductController } from "../controllers/basketProduct.controller.js";

const basketProductRouter = new Router();

basketProductRouter.post('/', basketProductController.addToBasket);
basketProductRouter.get('/', basketProductController.getBasketProduct);
basketProductRouter.delete('/:productId', basketProductController.delete);

export { basketProductRouter };