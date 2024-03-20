import { Basket } from "../models/models.js";

class BasketController {
  async getBasket(req, res) {
    try {
      const { userId } = req.query;

      const basket = await Basket.findOne({ where: { userId } });
      return res.json(basket);
    } catch (error) {
      console.log(error);
    }
  }
}

const basketController = new BasketController();

export { basketController };
