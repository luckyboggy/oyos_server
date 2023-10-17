import { OrderProduct } from "../models/models.js";

class OrderProductController {
  async addToOrder(req, res) {
    try {
      const { productId, orderId, selectedSize, quantity } = req.body;

      const orderItem = await OrderProduct.findOne({
        where: { productId, orderId, selectedSize },
      });

      if (orderItem) {
      } else {
        const orderProduct = await OrderProduct.create({
          productId,
          orderId,
          selectedSize,
          quantity,
        });
        return res.json(orderProduct);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderProducts(req, res) {
    try {
      const { orderId } = req.query;

      const orderProducts = await OrderProduct.findAndCountAll({
        where: {
          orderId,
        },
      });
      return res.json(orderProducts);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    const { productId } = req.params;
    const { selectedSize } = req.body;
    const orderProduct = await OrderProduct.destroy({
      where: { productId, selectedSize },
    });

    res.json(orderProduct);
  }
}

const orderProductController = new OrderProductController();

export { orderProductController };
