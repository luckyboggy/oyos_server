import Router from 'express';
import { collectionController } from '../controllers/collection.controller.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const collectionRouter = new Router();

collectionRouter.post('/', /* checkRole('ADMIN'), */ collectionController.create);
collectionRouter.get('/', collectionController.get);
collectionRouter.delete('/:id', /* checkRole('ADMIN'), */ collectionController.delete);

export { collectionRouter };