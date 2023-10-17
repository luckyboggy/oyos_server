import { Router } from "express";
import { orderProductController } from "../controllers/orderProduct.controller.js";

const orderProductRouter = new Router();

orderProductRouter.post('/', orderProductController.addToOrder);
orderProductRouter.get('/', orderProductController.getOrderProducts);
orderProductRouter.delete('/:productId', orderProductController.delete);

export { orderProductRouter };
