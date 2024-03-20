import { Collection } from "../models/models.js";
import { ApiError } from "../error/apiError.js";

class CollectionController {
  async create(req, res) {
    const { name } = req.body;
    const collection = await Collection.create({ name });
    return res.json(collection);
  }
  async get(req, res) {
    const collections = await Collection.findAll();
    return res.json(collections);
  }
  async delete(req, res) {
    const { id } = req.params;
    const collection = await Collection.destroy({ where: { id } });
    return res.json(collection);
  }
}

const collectionController = new CollectionController();

export { collectionController };
