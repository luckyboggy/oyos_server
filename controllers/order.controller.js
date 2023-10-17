import {
  Order,
  Basket,
  BasketProduct,
  OrderProduct,
  Product,
  ProductSize,
} from "../models/models.js";
import { sequelize } from "../db.js";
import { Op } from "sequelize";

class OrderController {
  async create(req, res) {
    const { userId } = req.body;
    const order = await Order.create({ userId: userId, status: "issued" });
    return res.json(order);
  }

  async changeStatus(req, res) {
    const { id, status } = req.body;

    await Order.update(
      {
        status: status,
      },
      {
        where: { id: id },
      }
    );

    return res.json([]);
  }

  async setNumber(req, res) {
    const { userId } = req.body;

    // получаем все заказы пользователя в хронологическом порядке
    const orders = await Order.findAndCountAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });

    // выделяем последний созданный (только что созданный)
    const newOrder = orders.rows[0];

    const newOrderId = newOrder.id;
    const newOrderNumber = `${userId.toString().padStart(4, 0)}-${newOrderId
      .toString()
      .padStart(4, 0)}`;

    await Order.update(
      {
        number: newOrderNumber,
      },
      {
        where: { id: newOrderId },
      }
    );

    return res.json([]);
  }

  async fromBasketToOrder(req, res) {

    const { userId } = req.body;
    console.log(userId);

    // получаем все заказы пользователя в хронологическом порядке
    const orders = await Order.findAndCountAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });

    // выделяем последний созданный (только что созданный)
    const newOrder = orders.rows[0];

    // корзина пользователя
    const basket = await Basket.findOne({ where: { userId } });

    console.log(basket)

    // содержимое корзины
    const basketProduct = await BasketProduct.findAndCountAll({
      where: { basketId: basket.id },
    });

    let totalPrice = 0;

    console.log(basketProduct)

    // перенос содержимого корзины в заказ / удаление из корзины / изменеие количества
    await basketProduct.rows.forEach((bp) => {
      console.log('tut4')
      Product.findOne({
        where: { id: bp.productId },
      })
        .then((product) => {
          totalPrice += product.price;
          OrderProduct.create({
            productId: bp.productId,
            orderId: newOrder.id,
            selectedSize: bp.selectedSize,
            quantity: bp.quantity,
            price: product.price,
          });
          ProductSize.update(
            {
              quantity: sequelize.literal(`quantity - ${bp.quantity}`),
            },
            {
              where: {
                productId: bp.productId,
                size: bp.selectedSize,
              },
            }
          );

          BasketProduct.destroy({
            where: {
              productId: bp.productId,
              selectedSize: bp.selectedSize,
            },
          });
        })
        .then(() => {
          Order.update(
            {
              totalPrice: totalPrice,
            },
            {
              where: { id: newOrder.id },
            }
          );
        });
    });

    return res.json([]);
  }

  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      console.log(userId)
      const orders = await Order.findAndCountAll({ where: { userId } });
      return res.json(orders);
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(req, res) {
    let { statuses } = req.query;
    let orders;
    if (statuses) {
      orders = await Order.findAndCountAll({
        where: { status: { [Op.in]: statuses } },
      });
    } else {
      orders = await Order.findAndCountAll();
    }

    return res.json(orders);
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.destroy({ where: { id } });
    return res.json(order);
  }
}

const orderController = new OrderController();

export { orderController };
