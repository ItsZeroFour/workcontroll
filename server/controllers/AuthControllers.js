import UserModel from "../models/UserModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET = process.env.SECRET;

export const registration = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ login: req.body.login });

    if (findUser) {
      return res.status(401).json({
        message: "Такой пользователь уже существует",
      });
    }

    console.log(req.body.login);

    if (!req.body.login || !req.body.password || !req.body.accountType) {
      return res.status(401).json({
        message: "Введите все обязательные поля",
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      login: req.body.login,
      password: hashPassword,
      accountType: req.body.accountType,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      {
        expiresIn: "30d",
      }
    );
    const userData = user.toObject();

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегестрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ login: req.body.login });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      res.status(400).json({ message: "Неверный логин или пароль" });
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      { expiresIn: "30d" }
    );

    if (user.accountType === "director") {
      const { password, personalOrders, ...userData } = user.toObject();

      res.status(200).json({ ...userData, token });
    } else {
      const { password, ...userData } = user.toObject();

      res.status(200).json({ ...userData, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось войти",
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId });

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден!",
      });
      return;
    }
    if (user.accountType === "director") {
      const { password, personalOrders, ...userData } = user.toObject();

      res.status(200).json({ ...userData });
    } else {
      const { password, ...userData } = user.toObject();

      res.status(200).json({ ...userData });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизироваться",
    });
  }
};
