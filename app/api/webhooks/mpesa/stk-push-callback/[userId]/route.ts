import { updateCredits } from '@/lib/actions/user.actions';
import Transaction from '@/lib/database/models/transaction.model';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    const body = await req.json();

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = body.Body?.stkCallback || {};

    console.log('stkPushCallback body:', body);

    if (ResultCode === 0 || ResultCode === '0') {
      const metaItems = Object.values(CallbackMetadata.Item || {}) as any[];

      const PhoneNumber = metaItems.find((o) => o.Name === 'PhoneNumber')?.Value?.toString();
      const Amount = metaItems.find((o) => o.Name === 'Amount')?.Value?.toString();
      const MpesaReceiptNumber = metaItems.find((o) => o.Name === 'MpesaReceiptNumber')?.Value?.toString();
      const TransactionDate = metaItems.find((o) => o.Name === 'TransactionDate')?.Value?.toString();

      console.log(`
        UserID: ${userId},
        MerchantRequestID: ${MerchantRequestID},
        CheckoutRequestID: ${CheckoutRequestID},
        ResultCode: ${ResultCode},
        ResultDesc: ${ResultDesc},
        PhoneNumber: ${PhoneNumber},
        Amount: ${Amount},
        MpesaReceiptNumber: ${MpesaReceiptNumber},
        TransactionDate: ${TransactionDate}
      `);

      const updatedTransaction = await Transaction.findOneAndUpdate(
        {
          buyer: userId,
          'mpesaDetails.phoneNumber': PhoneNumber,
          status: 'pending',
          checkoutRequestID: CheckoutRequestID,
        },
        {
          $set: {
            merchantRequestID: MerchantRequestID,
            resultCode: ResultCode,
            mpesaReceiptNumber: MpesaReceiptNumber,
            status: MpesaReceiptNumber?.length ? 'completed' : 'pending',
            transactionDate: TransactionDate,
            paymentStatus: MpesaReceiptNumber?.length ? 'paid' : 'not_paid',
          },
        },
        { sort: { createdAt: -1 }, new: true }
      ).exec();

      console.log('updatedTransaction:', updatedTransaction);

      if (MpesaReceiptNumber?.length && updatedTransaction?.credits && updatedTransaction?.buyer) {
        await updateCredits(updatedTransaction.buyer, updatedTransaction.credits);
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      console.warn('STK push failed: ', {
        userId,
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
      });

      return new Response(JSON.stringify({ success: false, message: ResultDesc }), { status: 200 });
    }
  } catch (error: any) {
    console.error('Callback processing error:', error);
    return new Response(
      JSON.stringify({
        message: 'Something went wrong with the callback',
        error: error.message,
      }),
      { status: 503 }
    );
  }
}
