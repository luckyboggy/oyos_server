import { Favorites } from "../models/models.js";

class FavoritesController {
  async getFavorites(req, res) {
    try {
      const { userId } = req.query;
      const favorites = await Favorites.findOne({ where: { userId } });
      return res.json(favorites);
    } catch (error) {
      console.log(error);
    }
  }
}

const favoritesController = new FavoritesController();

export { favoritesController };
