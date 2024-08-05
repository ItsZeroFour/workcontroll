import mongoose from "mongoose";

/**
 * @description Material schema for history (item for Array)
 */
const materialSchema = new mongoose.Schema(
  {
    stockName: {
      type: String,
      default: "GM",
    },

    materialName: {
      type: String,
    },

    count: {
      type: Number,
    },
  },
  { _id: false }
);

/**
 * @description History Item schema for create history of order work
 */
const HistoryItemSchema = new mongoose.Schema(
  {
    workType: {
      type: String,
      default: "",
    },

    materials: [materialSchema],

    comment: {
      type: String,
      default: "",
    },

    nextStage: {
      type: String,
      default: "",
    },

    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    startDate: {
      type: Date,
      default: "",
    },

    compiteDate: {
      type: Date,
      default: "",
    },
  },
  { _id: false }
);

/**
 * @description Main order schema with all attributes
 */
const OrderSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
  },

  client: {
    type: String,
    default: "",
  },

  itemName: {
    type: String,
    default: "",
  },

  materials: {
    type: String,
    default: "",
  },

  receiptDate: {
    type: Date,
    default: "",
  },

  dueDate: {
    type: Date,
    default: "",
  },

  fittingDate: {
    type: Date,
    default: null,
  },

  fittingTime: {
    type: String,
  },

  comment: {
    type: String,
    default: "",
  },

  cutter: {
    type: String,
    default: "",
  },

  gallery: {
    type: Array,
    default: [],
  },

  workType: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["work", "pending", "complete"],
    default: "work",
  },

  history: [HistoryItemSchema],
});

/**
 * @description Pre-save hook to automatically set the number
 */
OrderSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const lastOrder = await mongoose
      .model("Order")
      .findOne()
      .sort({ number: -1 });
    this.number = lastOrder ? lastOrder.number + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Order", OrderSchema);
