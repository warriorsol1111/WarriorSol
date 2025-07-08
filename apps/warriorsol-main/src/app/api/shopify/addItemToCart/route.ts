// /app/api/shopify/addItemToCart/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "@/lib/shopify";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../../../auth";

const CREATE_CART_MUTATION = `mutation CartCreate($lines: [CartLineInput!]!) {
  cartCreate(input: { lines: $lines }) {
    cart { id checkoutUrl }
    userErrors { message }
  }
}`;

const ADD_LINES_MUTATION = `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id }
    userErrors { message }
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const { merchandiseId, quantity } = await req.json();
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    if (cartId) {
      const { cartLinesAdd } = await fetchShopify(ADD_LINES_MUTATION, {
        cartId,
        lines: [{ merchandiseId, quantity }],
      });

      if (cartLinesAdd.userErrors.length > 0) {
        return NextResponse.json(
          { error: cartLinesAdd.userErrors[0].message },
          { status: 400 }
        );
      }

      return NextResponse.json({ cart: cartLinesAdd.cart });
    } else {
      const { cartCreate } = await fetchShopify(CREATE_CART_MUTATION, {
        lines: [{ merchandiseId, quantity }],
      });

      if (cartCreate.userErrors.length > 0) {
        return NextResponse.json(
          { error: cartCreate.userErrors[0].message },
          { status: 400 }
        );
      }

      cartId = cartCreate.cart.id;
      const session = await getServerSession(authConfig);
      if (!session) {
        return new Response("Unauthorized", { status: 401 });
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ cartId }),
      });
      if (!res.ok) {
        console.error("Failed to save cart ID to backend");
      }
      cookieStore.set("cartId", cartId as string, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
      });

      return NextResponse.json({ cart: cartCreate.cart });
    }
  } catch (err) {
    console.error("Error adding item to cart:", err);
    return NextResponse.json(
      { error: "Internal error adding to cart" },
      { status: 500 }
    );
  }
}
