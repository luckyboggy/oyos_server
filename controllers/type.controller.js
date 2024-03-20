import { Type } from "../models/models.js";
import { ApiError } from "../error/apiError.js";

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }
  async get(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }
  async delete(req, res) {
    const { id } = req.params;
    const type = await Type.destroy({ where: { id } });
    return res.json(type);
  }
}

const typeController = new TypeController();

export { typeController };
