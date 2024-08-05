/**
 * @access Private
 * @author t.me/ItsZeroFour
 * @copyright GM STUDIO 2024
 * @description This application is a cross-platform solution designed for managing construction projects, catering to two user types: Directors and Developers. It is developed using React Native and React Native for Web, ensuring compatibility across iOS, Android, and web platforms.
 * @private true
 * @license Software License Agreement
    This Software License Agreement ("Agreement") is made between the Licensor, [Your Company Name], and the Licensee, [User or Company Name], effective as of the date of download or access.
    The Licensor hereby grants the Licensee a non-exclusive, non-transferable, limited license to install and use the Project Management App ("Software") on compatible devices owned or controlled by the Licensee, in accordance with the terms and conditions of this Agreement. The Licensee shall not copy, modify, or create derivative works based on the Software; distribute, sell, lease, sublicense, or otherwise transfer the Software to any third party; reverse engineer, decompile, or disassemble the Software; or remove or alter any proprietary notices or labels on the Software.
    The Licensor retains all rights, title, and interest in and to the Software, including all intellectual property rights. This Agreement does not convey to the Licensee any ownership rights in the Software.
    This Agreement is effective until terminated. The Licensee may terminate this Agreement at any time by uninstalling and destroying all copies of the Software. The Licensor may terminate this Agreement immediately if the Licensee breaches any term of this Agreement. Upon termination, the Licensee must cease all use of the Software and destroy all copies in their possession.
    The Software is provided "as is" without warranty of any kind, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. The Licensor does not warrant that the Software will meet the Licensee's requirements or that the operation of the Software will be uninterrupted or error-free.
    In no event shall the Licensor be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of the use of or inability to use the Software, even if the Licensor has been advised of the possibility of such damages.
    This Agreement shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. This Agreement constitutes the entire agreement between the parties with respect to the use of the Software and supersedes all prior or contemporaneous understandings regarding such subject matter.
    By downloading, installing, or using the Software, the Licensee agrees to be bound by the terms and conditions of this Agreement. If the Licensee does not agree to these terms, they must not download, install, or use the Software.
    
    Licensor: [Company Name]
    Address: [Company Address]
    Contact: [Contact Information]
 **/

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import multer from "multer";
import path from "path";

dotenv.config({ path: "./.env" });

const app = express();

/* CONSTANTS */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

/* MIDDLEWARES */

app.use("/uploads", express.static("uploads"));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

/* ROUTES */
app.use("/user", AuthRoutes);
app.use("/order", OrderRoutes);

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      res.status(200).json({
        url: `/uploads/${req.file.filename}`,
      });
    } else {
      res.status(400).send("Файл не найден");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Не удалось загрузить файл");
  }
});

/* START FUNCTION */
async function start() {
  try {
    await mongoose
      .connect(MONGO_URI)
      .then(() => console.log(`Mongo db connection successfully`))
      .catch((err) => console.log(err));

    app.listen(PORT, (err) => {
      if (err) return console.log("Приложение аварийно завершилось: ", err);
      console.log(`Сервер успешно запущен! Порт: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
