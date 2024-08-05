import path from "path";
import OrderModel from "../models/OrderModel.js";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = async (req, res) => {
  try {
    const params = req.body;

    if (
      !params.client ||
      !params.itemName ||
      !params.materials ||
      !params.receiptDate ||
      !params.fittingDate
    ) {
      return res.status(401).json({
        message: "Заполните все обязательные поля",
      });
    }

    const doc = new OrderModel(params);

    await doc.save();

    return res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать заказ",
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await OrderModel.findById({ _id: req.params.id });

    if (!order) {
      return res.status(404).json({
        message: "Заказ не найден",
      });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказ",
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderId = req.body._id;
    const newParams = req.body;

    const order = await OrderModel.findById({ _id: orderId });

    if (!order) {
      return res.status(404).json({
        message: "Заказ не найден",
      });
    }

    if (newParams.gallery && Array.isArray(newParams.gallery)) {
      newParams.gallery = newParams.gallery.filter((filePath) => {
        const fullPath = path.join(process.cwd(), filePath);

        console.log(fullPath);

        return fs.existsSync(fullPath);
      });
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: newParams },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить заказ",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();

    if (!orders) {
      return res.status(404).json({
        message: "Заказы не найдены",
      });
    }

    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказы",
    });
  }
};

export const uploadFileToOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.updateOne(
      { _id: orderId },
      {
        $push: { gallery: req.body.filePath },
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Заказ не найден",
      });
    }

    res.status(200).json({
      message: "Успешно!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось загрузить файл в заказ",
    });
  }
};
