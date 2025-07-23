// /app/api/cart/create/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextApiRequest } from "next";

import { fetchShopify } from "../../../../lib/shopify";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lineItems = body.lineItems || [];

    const CREATE_CART_MUTATION = `
        mutation CartCreate($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              id
              checkoutUrl
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        product {
                          title
                          images(first: 1) {
                            edges {
                              node {
                                url
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

    const data = await fetchShopify(CREATE_CART_MUTATION, {
      lines: lineItems,
    });

    if (data.cartCreate.userErrors.length > 0) {
      return NextResponse.json(
        { error: data.cartCreate.userErrors[0].message },
        { status: 400 }
      );
    }

    const cart = data.cartCreate.cart;
    const cookieStore = await cookies();
    cookieStore.set("cartId", cart.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
    });
    const token = await getToken({ req: request as unknown as NextApiRequest });

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({ cartId: cart.id }),
    });

    if (!res.ok) {
      console.error("Failed to save cart ID to backend");
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    );
  }
}
