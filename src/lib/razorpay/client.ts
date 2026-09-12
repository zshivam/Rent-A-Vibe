import Razorpay from 'razorpay';

const keyId     = process.env.RAZORPAY_KEY_ID     ?? '';
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';

/**
 * Shared Razorpay SDK instance.
 * ⚠️  Server-side only — contains the secret key.
 */
export const razorpay = new Razorpay({
  key_id:     keyId     || 'rzp_placeholder_id',
  key_secret: keySecret || 'placeholder_secret',
});

/** Security deposit in paise (₹2,000 = 200,000 paise) */
export const SECURITY_DEPOSIT_PAISE = parseInt(
  process.env.SECURITY_DEPOSIT_PAISE ?? '200000',
  10
);

/** Razorpay currency — INR only for now */
export const CURRENCY = 'INR';
