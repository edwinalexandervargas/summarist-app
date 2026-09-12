import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return NextResponse.json({ status: "basic" });
    }

    const customerId = customers.data[0].id;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ status: "basic" });
    }

    const subscription = subscriptions.data[0];

    return NextResponse.json({
      status: subscription.status,
      trialEnd: subscription.trial_end,
      currentPeriodEnd: subscription.current_period_end,
      priceId: subscription.items.data[0].price.id,
    });
  } catch (err) {
    console.log("Subscription status error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
