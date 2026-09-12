import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { priceId, isAnnual } = await request.json();

    const sessionConfig = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/for-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/choose-plan`,
    };

    if (isAnnual) {
      sessionConfig.subscription_data = {
        trial_period_days: 7,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log("Stripe checkout error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}