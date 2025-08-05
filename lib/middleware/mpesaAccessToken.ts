import axios from 'axios';

export async function getMpesaAccessToken(): Promise<string> {
  const url = `${process.env.SAFARICOM_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(
    `${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
}
