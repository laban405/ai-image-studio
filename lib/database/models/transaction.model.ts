import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    unique: true,
    required: false,
    sparse: true,
  },
  paymentMethod: {
    type: String,
    required: false,
  },
  transactionId: {
    type: String,
    unique: true,
    required: false,
    sparse: true,
  },
  status: {
    type: String,
    required: false,
    sparse: true, 
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  resultCode: {
    type: String,
    required: false,
  },
  checkoutRequestID: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  mpesaReceiptNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  merchantRequestID: {
    type: String,
    required: false,
  },
  transactionDate: {
    type: String,
    required: false,
  },
  mpesaDetails: {
    phoneNumber: {
      type: String,
    },
  },
});

const Transaction =
  models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
