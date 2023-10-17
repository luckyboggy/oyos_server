import { BasketProduct } from "../models/models.js";

class BasketProductController {
  async addToBasket(req, res) {
    try {
      const { productId, basketId, selectedSize, quantity } = req.body;

      // Проверка, есть ли данный товар в корзине
      const basketItem = await BasketProduct.findOne({
        where: { productId, basketId, selectedSize },
      });

      if (basketItem) {
      } else {
        const basketProduct = await BasketProduct.create({
          basketId,
          productId,
          selectedSize,
          quantity,
        });
        return res.json(basketProduct);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBasketProduct(req, res) {
    try {
      const { basketId } = req.query;

      const basketProduct = await BasketProduct.findAndCountAll({
        where: { basketId },
      });
      return res.json(basketProduct);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    const { productId } = req.params;
    const { selectedSize } = req.body;
    const basketProduct = await BasketProduct.destroy({
      where: { productId, selectedSize },
    });
    return res.json(basketProduct);
  }
}

const basketProductController = new BasketProductController();

export { basketProductController };
