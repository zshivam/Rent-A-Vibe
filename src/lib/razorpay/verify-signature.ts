import crypto from 'crypto';

/**
 * Verifies the Razorpay payment signature to confirm authenticity.
 *
 * @param orderId       - The Razorpay order ID returned at order creation
 * @param paymentId     - The Razorpay payment ID received on the frontend
 * @param signature     - The signature sent by Razorpay to the frontend
 * @returns             - True if signature is valid, false otherwise
 *
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#step-3-handle-the-payment-success-response
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured');
  }

  // Razorpay signature = HMAC-SHA256(orderId + '|' + paymentId, secret)
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Use timingSafeEqual to prevent timing attacks
  const expected = Buffer.from(expectedSignature, 'hex');
  const received = Buffer.from(signature, 'hex');

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}
