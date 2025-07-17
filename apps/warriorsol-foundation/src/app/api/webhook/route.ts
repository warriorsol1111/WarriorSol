import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Raw body required!
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // Get raw body (important!)
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Webhook signature verification failed:", err.message);
    } else {
      console.error("❌ Webhook signature verification failed:", err);
    }
    return new NextResponse("Webhook error", { status: 400 });
  }

  // ✅ Handle successful donation
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const donorName = session.metadata?.donor_name;
    const donationType = session.metadata?.donation_type;
    const email = session.customer_email;
    const amount = session.amount_total;

    console.log("🎉 New Donation Received!");
    console.log({
      name: donorName,
      email,
      amount: `$${(amount ?? 0) / 100}`,
      type: donationType,
    });

    // ⏳ Future: Save this to your DB here
  }
  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;

    console.log("💌 Receipt URL:", charge.receipt_url);
  }

  return new NextResponse("ok", { status: 200 });
}
