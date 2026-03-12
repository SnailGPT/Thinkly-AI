import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is not set. Stripe will not be fully functional.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2024-06-20",
    typescript: true,
});

export const PRO_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_pro_10_usd_month";

