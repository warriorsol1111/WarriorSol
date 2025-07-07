// /app/api/cart/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";
import { cookies } from "next/headers";

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

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    );
  }
}
