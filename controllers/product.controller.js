import { Product, ProductInfo, ProductSize } from "../models/models.js";
import { v4 } from "uuid";
import path from "path";
import { ApiError } from "../error/ApiError.js";
import { Op } from "sequelize";

const __dirname = path.resolve();

class ProductController {
  async create(req, res, next) {
    try {
      let {
        name,
        price,
        typeId,
        collectionId,
        description,
        materials,
        info,
        productSize,
      } = req.body;
      let { img } = req.files || false;
      console.log(img);

      let imgArr = [];

      if (img) {
        if (img.length > 1) {
          img = [...img];
        } else {
          img = [img];
        }

        for (let i = 0; i < img.length; i++) {
          let fileName = v4() + ".png";

          img[i].mv(
            path.resolve(__dirname, "..", "server", "static", fileName)
          );
          imgArr.push(fileName);
        }
      }

      const product = await Product.create({
        name,
        price,
        typeId,
        collectionId,
        description,
        materials,
        img: imgArr,
      });

      if (info) {
        console.log(info);
        //info = JSON.parse(info);
        info.forEach((i) => {
          ProductInfo.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          });
        });
      }

      if (productSize) {
        productSize = JSON.parse(productSize);
        productSize.forEach((item) => {
          ProductSize.create({
            size: item.size,
            quantity: item.quantity,
            productId: product.id,
          });
        });
      }

      return res.json(product);
    } catch (err) {
      next(ApiError.badRequest(err.message));
    }
  }

  // Обновление продукта
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        price,
        typeId,
        collectionId,
        description,
        materials,
        info,
        productSize,
      } = req.body;
      let { img } = req.files || false;

      // Обновление изображений
      let imgArr = [];
      if (img) {
        if (img.length > 1) {
          img = [...img];
        } else {
          img = [img];
        }

        for (let i = 0; i < img.length; i++) {
          let fileName = v4() + ".png";
          img[i].mv(
            path.resolve(__dirname, "..", "server", "static", fileName)
          );
          imgArr.push(fileName);
        }
      }

      // Обновление параметров модели
      await Product.update(
        {
          name,
          price,
          typeId,
          collectionId,
          description,
          materials,
          img: imgArr,
        },
        { where: { id } }
      );

      // Обновление информации о продукте
      if (info) {
        await ProductInfo.destroy({ where: { productId: id } });
        info.forEach((i) => {
          ProductInfo.create({
            title: i.title,
            description: i.description,
            productId: id,
          });
        });
      }

      // Обновление размеров продукта
      if (productSize) {
        await ProductSize.destroy({ where: { productId: id } });
        productSize.forEach((item) => {
          ProductSize.create({
            size: item.size,
            quantity: item.quantity,
            productId: id,
          });
        });
      }

      // Возвращаем обновленный продукт
      const updatedProduct = await Product.findOne({
        where: { id },
        include: [
          { model: ProductInfo, as: "info" },
          { model: ProductSize, as: "productSize" },
        ],
      });

      return res.json(updatedProduct);
    } catch (err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async getAll(req, res) {
    let { typeIds, collectionId, limit, page, sortType } = req.query;
    console.log(typeIds)
    sortType = sortType || ["updatedAt", "ASC"];
    limit = limit || 8;
    page = page || 1;
    let offset = limit * page - limit;
    let products;
    if (typeIds && collectionId) {
      products = await Product.findAndCountAll({
        where: { typeId: { [Op.in]: typeIds }, collectionId },
        order: [sortType],
        limit,
        offset,
      });
    } else if (typeIds) {
      products = await Product.findAndCountAll({
        where: { typeId: { [Op.in]: typeIds } },
        order: [sortType],
        limit,
        offset,
      });
    } else if (collectionId) {
      products = await Product.findAndCountAll({
        where: { collectionId },
        order: [sortType],
        limit,
        offset,
      });
    } else {
      products = await Product.findAndCountAll({
        order: [sortType],
        limit,
        offset,
      });
    }

    return res.json(products);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: [
        { model: ProductInfo, as: "info" },
        { model: ProductSize, as: "productSize" },
      ],
    });
    res.json(product);
  }
  async delete(req, res) {
    const { id } = req.params;
    const product = await Product.destroy({ where: { id } });
    return res.json(product);
  }
}

const productController = new ProductController();

export { productController };
