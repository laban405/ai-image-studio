"use server";

import { redirect } from "next/navigation";
import { getTimestamp, handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";

import axios from "axios";

import { getMpesaAccessToken } from "../middleware/mpesaAccessToken";

export async function checkoutMpesaCredits(
  transaction: CheckoutTransactionParams
) {
  const response = await initiateSTKPush(transaction);

  return response;
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}

const initiateSTKPush = async (req: CheckoutTransactionParams) => {
  try {
    const { amount, mpesaPhone, buyerId, credits, plan } = req;

    console.log("initiate stk push", {
      amount,
      mpesaPhone,
      buyerId,
      credits,
      plan,
    });

    const safaricom_access_token = await getMpesaAccessToken();

    const url = `${process.env.SAFARICOM_BASE_URL}/mpesa/stkpush/v1/processrequest`;
    const auth = "Bearer " + safaricom_access_token;

    const timestamp = getTimestamp();
    const password = Buffer.from(
      process.env.BUSINESS_SHORT_CODE! + process.env.PASS_KEY! + timestamp
    ).toString("base64");

    const callback_url = `${process.env.MPESA_CALLBACK_BASE_URL}/api/webhooks/mpesa/stk-push-callback/${buyerId}`;

    const payload = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: mpesaPhone,
      PartyB: process.env.TILL_NUMBER,
      PhoneNumber: mpesaPhone,
      CallBackURL: callback_url,
      AccountReference: "Mikrosell AI",
      TransactionDesc: `O${buyerId}-T${timestamp}-P${mpesaPhone}-A${amount}`,
    };

    console.log("initiate stk push payload:", payload);

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: auth,
      },
    });

    console.log("initiate stk push response:", response.data);

    // If the request is successful,save transaction and send the response body to the client
    // To do be moved to own event
    const transaction: CreateTransactionParams = {
      buyerId: buyerId,
      paymentMethod: "mpesa",
      amount,
      transactionId: `O${buyerId}-T${timestamp}-P${mpesaPhone}-A${amount}`,
      status: "pending",
      checkoutRequestID: response.data["CheckoutRequestID"],
      mpesaDetails: {
        phoneNumber: mpesaPhone,
      },
      credits,
      plan,
    };

    const newTransaction = await createTransaction(transaction);

    console.log("newTransaction:", newTransaction);
    return {
      success: true,
      data: newTransaction,
    };
  } catch (error: any) {
    console.error("Error initiating payment: ", error);
    return {
      success: false,
      error: error?.response?.data || error?.message || "Unknown error",
    };
  }
};
