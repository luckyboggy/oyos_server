import Router from 'express';
import { typeController } from '../controllers/type.controller.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const typeRouter = new Router();

typeRouter.post('/', /* checkRole('ADMIN'), */ typeController.create);
typeRouter.get('/', typeController.get);
typeRouter.delete('/:id', /* checkRole('ADMIN'), */ typeController.delete);

export { typeRouter };