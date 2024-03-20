import { FavoritesProduct } from "../models/models.js";

class FavoritesProductController {
  async addToFavorites(req, res) {
    try {
      const { productId, favoriteId } = req.body;

      // Проверка, есть ли данный товар в избранном
      const favoritesItem = await FavoritesProduct.findOne({
        where: { productId, favoriteId },
      });

      if (favoritesItem) {
      } else {
        const favoritesProduct = await FavoritesProduct.create({
          favoriteId,
          productId,
        });
        return res.json(favoritesProduct);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getFavoritesProduct(req, res) {
    try {
      const { favoriteId } = req.query;

      const favoritesProduct = await FavoritesProduct.findAndCountAll({
        where: { favoriteId },
      });
      return res.json(favoritesProduct);
    } catch (error) { }
  }

  async delete(req, res) {
    const { productId } = req.params;
    const favoritesProduct = await FavoritesProduct.destroy({ where: { productId } });
    return res.json(favoritesProduct)
  }
}

const favoritesProductController = new FavoritesProductController();

export { favoritesProductController };
