import { Router } from "express";
import { orderController } from '../controllers/order.controller.js'

const orderRouter = new Router();

orderRouter.post('/', orderController.create);
orderRouter.post('/basketToOrder', orderController.fromBasketToOrder);
orderRouter.post('/setNumber', orderController.setNumber);
orderRouter.post('/changeStatus', orderController.changeStatus);
orderRouter.get('/', orderController.getAll);
orderRouter.get('/:userId', orderController.getByUser);
orderRouter.delete('/:id', orderController.delete);


export { orderRouter };
