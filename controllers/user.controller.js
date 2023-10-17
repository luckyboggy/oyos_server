import { ApiError } from "../error/ApiError.js";
import { User, Basket, Favorites, Address } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateJwt = (id, name, surename, email, phone, role) => {
  return jwt.sign(
    { id, name, surename, email, phone, role },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

class UserController {
  async registration(req, res, next) {
    const { name, surename, email, phone, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или пароль"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      name,
      surename,
      email,
      phone,
      role,
      password: hashPassword,
    });
    const basket = await Basket.create({ userId: user.id });
    const favorites = await Favorites.create({ userId: user.id });
    const address = await Address.create({ userId: user.id });

    const jsonWebToken = generateJwt(
      user.id,
      user.name,
      user.surename,
      user.email,
      user.phone,
      user.role,
    );

    return res.json({ jsonWebToken });
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("Пользователь с таким email не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      next(ApiError.internal("Неверный пароль"));
    }

    const jsonWebToken = generateJwt(
      user.id,
      user.name,
      user.surename,
      user.email,
      user.phone,
      user.role,
    );
    try {
      return res.json({ jsonWebToken });
    } catch (error) { }
  }
  async check(req, res, next) {
    const jsonWebToken = generateJwt(
      req.user.id,
      req.user.name,
      req.user.surename,
      req.user.email,
      req.user.phone,
      req.user.role,
    );

    return res.json({ jsonWebToken });
  }

  async change(req, res, next) {
    const { name, surename, email, phone } = req.body;
    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (surename) {
      updateFields.surename = surename;
    }

    if (phone) {
      updateFields.phone = phone;
    }

    await User.update(updateFields, {
      where: { email }
    });

    const user = await User.findOne({ where: { email } })
    return res.json(user)
  }

  async getOne(req, res) {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id }
    })
    return res.json(user)
  }

  async changeAddres(req, res) {
    const { userId, region, city, street, house, flat, zipCode } = req.body;

    console.log(userId, region, city, street, house, flat, zipCode);

    const updateFields = {};

    if (region) {
      updateFields.region = region;
    }
    if (city) {
      updateFields.city = city
    }
    if (street) {
      updateFields.street = street;
    }
    if (house) {
      updateFields.house = house;
    }
    if (flat) {
      updateFields.flat = flat;
    }
    if (zipCode) {
      updateFields.zipCode = zipCode;
    }

    await Address.update(updateFields, {
      where: {
        userId
      }
    })

    const address = await Address.findOne({ where: { userId } })
    return res.json(address)
  }

  async getAddress(req, res) {
    const { userId } = req.query;
    const address = await Address.findOne({ where: { userId } })
    return res.json(address)
  }


}

const userController = new UserController();

export { userController };
