import axios from 'axios';
import { NextRequest } from 'next/server';
import { getMpesaAccessToken } from '@/lib/middleware/mpesaAccessToken';
import Transaction from '@/lib/database/models/transaction.model';
import { updateCredits } from '@/lib/actions/user.actions';
import { getTimestamp } from '@/lib/utils';



export async function POST(req: NextRequest, { params }: { params: { checkoutRequestID: string } }) {
  try {
    const { checkoutRequestID } = params;
    const timestamp = getTimestamp();

    const password = Buffer.from(
      process.env.BUSINESS_SHORT_CODE! + process.env.PASS_KEY! + timestamp
    ).toString('base64');

    const safaricom_access_token = await getMpesaAccessToken();

    const mpesaResponse = await axios.post(
      `${process.env.SAFARICOM_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      },
      {
        headers: {
          Authorization: `Bearer ${safaricom_access_token}`,
        },
      }
    );

    const body = mpesaResponse.data;

    if (body?.ResultCode === 0 || body?.ResultCode === '0') {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { checkoutRequestID, status: 'pending' },
        { $set: { status: 'completed' } },
        { sort: { createdAt: -1 }, new: true }
      ).exec();

      if (updatedTransaction?.buyer && updatedTransaction?.credits) {
        await updateCredits(updatedTransaction.buyer, updatedTransaction.credits);
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment not completed',
          data: { mpesaResponse: body },
        }),
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in confirmPayment:', error);
    return new Response(
      JSON.stringify({
        message: error.message || 'Error confirming payment',
        error,
      }),
      { status: 503 }
    );
  }
}
