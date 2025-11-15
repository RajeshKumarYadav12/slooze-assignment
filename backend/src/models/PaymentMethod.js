const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "wallet"],
      required: true,
    },
    cardLast4: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
