import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  login: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },

  accountType: {
    type: String,
    enum: ["director", "developer", "user"],
    require: true,
  },

  personalOrders: {
    type: [String],
  },
});

UserModel.pre("save", function (next) {
  if (this.accountType === "director") {
    this.personalOrders = undefined;
  }
  next();
});

export default mongoose.model("User", UserModel);
