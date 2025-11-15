const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PaymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["credit_card", "debit_card", "upi", "wallet"],
    required: true,
  },
  cardLast4: String,
  provider: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "MEMBER"],
      default: "MEMBER",
    },
    country: {
      type: String,
      enum: ["India", "America"],
      required: true,
    },
    paymentMethods: [PaymentMethodSchema],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
