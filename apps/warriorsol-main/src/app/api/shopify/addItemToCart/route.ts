// /app/api/shopify/addItemToCart/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "@/lib/shopify";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../../../auth";

const CREATE_CART_MUTATION = `mutation CartCreate($lines: [CartLineInput!]!, $attributes: [AttributeInput!]) {
  cartCreate(input: { lines: $lines, attributes: $attributes }) {
    cart { 
      id 
      checkoutUrl 
      attributes {
        key
        value
      }
    }
    userErrors { message }
  }
}`;

const ADD_LINES_MUTATION = `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id }
    userErrors { message }
  }
}`;

const UPDATE_CART_ATTRIBUTES_MUTATION = `mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
  cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
    cart { 
      id 
      attributes {
        key
        value
      }
    }
    userErrors { message }
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const { merchandiseId, quantity, userId } = await req.json();
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    // Get session for authentication and userId validation
    const session = await getServerSession(authConfig);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (cartId) {
      // Add items to existing cart
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

      // Update cart attributes to ensure userId is preserved/added
      if (userId) {
        const { cartAttributesUpdate } = await fetchShopify(
          UPDATE_CART_ATTRIBUTES_MUTATION,
          {
            cartId,
            attributes: [{ key: "user_id", value: userId }],
          }
        );

        if (cartAttributesUpdate.userErrors.length > 0) {
          console.error(
            "Failed to update cart attributes:",
            cartAttributesUpdate.userErrors
          );
        }
      }

      return NextResponse.json({ cart: cartLinesAdd.cart });
    } else {
      // Create new cart with userId attribute
      const cartAttributes = userId ? [{ key: "user_id", value: userId }] : [];

      const { cartCreate } = await fetchShopify(CREATE_CART_MUTATION, {
        lines: [{ merchandiseId, quantity }],
        attributes: cartAttributes,
      });

      if (cartCreate.userErrors.length > 0) {
        return NextResponse.json(
          { error: cartCreate.userErrors[0].message },
          { status: 400 }
        );
      }

      cartId = cartCreate.cart.id;

      // Save to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          cartId,
        }),
      });

      if (!res.ok) {
        console.error("Failed to save cart ID to backend");
      }

      // Set cart cookie
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
