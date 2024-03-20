import Router from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddlewere } from '../middleware/authMiddlewere.js';

const userRouter = new Router();

userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.post('/change', userController.change);
userRouter.get('/auth', authMiddlewere, userController.check);
userRouter.get("/:id", userController.getOne);

export { userRouter };