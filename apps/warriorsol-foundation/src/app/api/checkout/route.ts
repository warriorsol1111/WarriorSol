import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  const body = await req.json();

  const { amount, email, name, donationType, userId, foundation } = body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: donationType === "monthly" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        donationType === "monthly"
          ? {
              price: getRecurringPriceId(amount),
              quantity: 1,
            }
          : {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Donation to Warrior Sol Foundation",
                  description:
                    "Support families facing their greatest challenges",
                },
                unit_amount: amount * 100,
              },
              quantity: 1,
            },
      ],

      customer_email: email,
      metadata: {
        donor_name: name,
        donation_type: donationType,
        user_id: userId ?? "anonymous",
        foundation,
      },

      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}

function getRecurringPriceId(amount: string) {
  const map: Record<string, string> = {
    "10": "price_1RlrihPTBH0WqyTA1CxIZsyo",
    "25": "price_1RlrjFPTBH0WqyTAGx8IrltI",
    "50": "price_1RlrjmPTBH0WqyTAiYZqVChT",
    "100": "price_1RlrkMPTBH0WqyTAfVPivqay",
    "250": "price_1RlrkoPTBH0WqyTApnq4mndb",
    "500": "price_1RlrlDPTBH0WqyTAJyzMT6a9",
  };
  return map[amount] ?? "price_1RlrihPTBH0WqyTA1CxIZsyo";
}
