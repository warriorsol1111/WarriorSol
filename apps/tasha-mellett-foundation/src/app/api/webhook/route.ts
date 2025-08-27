import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook error", { status: 400 });
  }

  const extractBestReceipt = (invoice: Stripe.Invoice): string => {
    const paymentIntent = (
      invoice as unknown as {
        payment_intent?: Stripe.PaymentIntent & {
          charges?: { data: Stripe.Charge[] };
        };
      }
    ).payment_intent;
    const charges = paymentIntent?.charges?.data ?? [];
    const chargeUrl = charges[0]?.receipt_url;
    return chargeUrl || invoice.hosted_invoice_url || "";
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const stripeSessionId = session.id;
    const donorName = session.metadata?.donor_name;
    const donationType = session.metadata?.donation_type;
    const email = session.customer_email;
    const amount = session.amount_total;
    const userId = session.metadata?.user_id ?? null;
    const foundation = session.metadata?.foundation;

    let receiptUrl = "";

    try {
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
          { expand: ["latest_invoice.payment_intent.charges"] }
        );

        const invoice = subscription.latest_invoice as Stripe.Invoice;
        receiptUrl = extractBestReceipt(invoice);
      }
    } catch (err) {
      console.error("🧾 Failed to extract receipt on session completion:", err);
    }
    let endpoint = "";
    if (foundation === "tasha-mellett-foundation") {
      endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasha-foundation/donations`;
    } else if (foundation === "warriorsol-foundation") {
      endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations`;
    }
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeSessionId,
          stripeReceiptUrl: receiptUrl,
          stripeSubscriptionId: session.subscription || null,
          name: donorName,
          email,
          amount: amount ?? 0,
          currency: session.currency || "usd",
          donationType,
          status: session.payment_status ?? "succeeded",
          userId,
          foundation,
        }),
      });

      if (!response.ok) {
        console.error("❌ Failed to save donation:", await response.text());
      } else {
        console.log("Donation saved to DB");
      }
    } catch (err) {
      console.error("💥 Error saving donation:", err);
    }
  }
  if (event.type === "charge.succeeded" || event.type === "charge.updated") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent as string;

    try {
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      const session = sessions.data[0];
      const foundation = session?.metadata?.foundation;
      const sessionId = session?.id;

      let endpoint = "";
      if (foundation === "tasha-mellett-foundation") {
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasha-foundation/donations/update-receipt-by-session/${sessionId}`;
      } else if (foundation === "warriorsol-foundation") {
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/update-receipt-by-session/${sessionId}`;
      }

      if (sessionId && charge.receipt_url && endpoint) {
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripeReceiptUrl: charge.receipt_url }),
        });

        if (!res.ok) {
          console.error("Failed to update receipt:", await res.text());
        } else {
          console.log(
            `Receipt URL updated for one-time charge on ${foundation}`
          );
        }
      }
    } catch (err) {
      console.error("Error updating receipt from charge event:", err);
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string;
    };
    const subscriptionId = invoice.subscription;
    const receiptUrl = extractBestReceipt(invoice);
    const amount = invoice.amount_paid;
    const currency = invoice.currency;
    const foundation = invoice.metadata?.foundation;
    console.log("foundation metadata:", foundation);
    console.log("backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

    const customerEmail =
      invoice.customer_email || (invoice.customer as string);
    let endpoint = "";
    if (foundation === "tasha-mellett-foundation") {
      endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasha-foundation/donations`;
    } else if (foundation === "warriorsol-foundation") {
      endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations`;
    }
    try {
      // Create a new donation record for this recurring payment
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeInvoiceId: invoice.id,
          stripeSubscriptionId: subscriptionId,
          stripeReceiptUrl: receiptUrl,
          amount,
          currency,
          email: customerEmail,
          name: invoice.customer_name || "Recurring Donor",
          donationType: "monthly",
          status: "paid",
        }),
      });

      if (!res.ok) {
        console.error(
          "❌ Failed to save recurring donation:",
          await res.text()
        );
      } else {
        console.log("✅ Recurring donation saved to DB");
      }
    } catch (err) {
      console.error("💥 Error saving recurring donation:", err);
    }
  }

  return new NextResponse("ok", { status: 200 });
}
