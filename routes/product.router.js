import Router from "express";
import { productController } from "../controllers/product.controller.js";
import { checkRole } from "../middleware/checkRoleMiddleware.js";

const productRouter = new Router();

productRouter.post("/", /* checkRole("ADMIN"), */ productController.create);
productRouter.post("/:id", /* checkRole("ADMIN"), */ productController.update);
productRouter.get("/", productController.getAll);
productRouter.get("/:id", productController.getOne);
productRouter.delete("/:id", productController.delete);

export { productRouter };
